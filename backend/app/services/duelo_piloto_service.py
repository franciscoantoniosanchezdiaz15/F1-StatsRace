import random

from app.models.duelo import Duelo
from app.models.exceptions import CircuitoNoEncontradoException, RivalNoDisponibleException, DueloInvalidoException, DueloNoEncontradoException, UsuarioNotFoundException
from app.repositories.duelo_piloto_repo import crear_duelo, obtener_duelos_usuario, obtener_duelo_por_id, eliminar_duelo
from app.repositories.usuario_repo import obtener_usuario_por_id
from app.services.circuito_service import listar_circuitos_client
from app.services.piloto_service import extraer_sessions_carrera, listar_pilotos_client
from app.services.neumatico_service import resolver_compuesto_piloto
from app.clients.f1_client import OpenF1Client

client = OpenF1Client()
YEAR = 2023


def crear_duelo_resumen(duelo: Duelo):
    return {
        "id": duelo.id,
        "tipo_rival": duelo.tipo_rival,
        "modo": duelo.modo,
        "year": YEAR,
        "driver_number_1": duelo.driver_number_1,
        "piloto1": duelo.piloto1,
        "driver_number_2": duelo.driver_number_2,
        "piloto2": duelo.piloto2,
        "circuito_key": duelo.circuito_key,
        "circuito": duelo.circuito,
        "ganador": duelo.ganador,
        "tiempo_1": duelo.tiempo_1,
        "tiempo_2": duelo.tiempo_2,
        "diferencia": duelo.diferencia,
        "ganador_usuario_id": duelo.ganador_usuario_id,
    }


def crear_piloto_resumen_base(piloto_data: dict):
    return {
        "driver_number": piloto_data.get("driver_number"),
        "full_name": piloto_data.get("full_name"),
        "team_name": piloto_data.get("team_name"),
    }


def obtener_piloto_por_driver_number(driver_number: int):
    pilotos = listar_pilotos_client()

    if not pilotos:
        return None

    for piloto in pilotos:
        if piloto.get("driver_number") == driver_number:
            return piloto

    return None


def seleccionar_rival(modo_rival: str, driver_number_1: int, driver_number_2: int | None):
    pilotos = listar_pilotos_client()

    if not pilotos:
        raise RivalNoDisponibleException()

    if modo_rival == "manual":
        if not driver_number_2:
            raise DueloInvalidoException()

        if driver_number_1 == driver_number_2:
            raise DueloInvalidoException()

        for piloto in pilotos:
            if piloto.get("driver_number") == driver_number_2:
                return piloto

        raise RivalNoDisponibleException()

    if modo_rival == "aleatorio":
        disponibles = []

        for piloto in pilotos:
            if piloto.get("driver_number") != driver_number_1:
                disponibles.append(piloto)

        if not disponibles:
            raise RivalNoDisponibleException()

        return random.choice(disponibles)

    raise DueloInvalidoException()


def seleccionar_circuito(modo_circuito: str, circuito_key: int | None):
    circuitos = listar_circuitos_client()

    if not circuitos:
        raise CircuitoNoEncontradoException()

    if modo_circuito == "manual":
        if not circuito_key:
            raise DueloInvalidoException()

        for circuito in circuitos:
            if circuito.get("circuit_key") == circuito_key:
                return circuito

        raise CircuitoNoEncontradoException()

    if modo_circuito == "aleatorio":
        return random.choice(circuitos)

    raise DueloInvalidoException()


def obtener_session_key_por_circuito(circuito_key: int):
    carreras = extraer_sessions_carrera()

    if not carreras:
        raise CircuitoNoEncontradoException()

    for carrera in carreras:
        if carrera.get("circuit_key") == circuito_key:
            return carrera.get("session_key")

    raise CircuitoNoEncontradoException()


def obtener_resultado_piloto(session_key: int, driver_number: int):
    resultados = client.fetch_session_resultado_por_drivers(session_key, [
                                                            driver_number])

    if not resultados:
        return None

    for resultado in resultados:
        if resultado.get("driver_number") == driver_number:
            return resultado

    return None


def es_resultado_valido_carrera(resultado: dict):
    if not resultado:
        return False

    if resultado.get("dnf") or resultado.get("dns") or resultado.get("dsq"):
        return False

    puntos = resultado.get("points")
    if puntos is None:
        return False

    try:
        float(puntos)
        return True
    except Exception:
        return False


def obtener_detalle_carrera_piloto(session_key: int, piloto_data: dict, compuesto_usuario=None):
    driver_number = piloto_data["driver_number"]
    resultado = obtener_resultado_piloto(session_key, driver_number)

    puntos = 0.0
    valido = False

    if resultado and es_resultado_valido_carrera(resultado):
        try:
            puntos = float(resultado.get("points"))
            valido = True
        except Exception:
            puntos = 0.0

    info_compuesto = resolver_compuesto_piloto(
        session_key,
        driver_number,
        compuesto_usuario,
        "carrera"
    )

    valor_final = puntos + info_compuesto["bonus_compuesto"]

    datos_piloto = crear_piloto_resumen_base(piloto_data)
    datos_piloto["valor"] = round(valor_final, 3)
    datos_piloto["valido"] = valido
    datos_piloto["bonus_compuesto"] = info_compuesto["bonus_compuesto"]
    datos_piloto["compuesto_elegido"] = info_compuesto["compuesto_elegido"]
    datos_piloto["compuesto_real"] = info_compuesto["compuesto_real"]
    datos_piloto["acierto_compuesto"] = info_compuesto["acierto_compuesto"]
    datos_piloto["position"] = resultado.get("position") if resultado else None

    return datos_piloto


def obtener_vueltas_piloto(session_key: int, driver_number: int):
    vueltas = client.fetch_laps_por_driver(session_key, driver_number)

    if vueltas is None:
        return []

    return vueltas


def extraer_vueltas_validas(vueltas: list[dict]):
    validas = []

    for vuelta in vueltas:
        if not vuelta:
            continue

        if vuelta.get("is_pit_out_lap"):
            continue

        lap_duration = vuelta.get("lap_duration")
        if lap_duration is None:
            continue

        try:
            lap_duration = float(lap_duration)
        except Exception:
            continue

        if lap_duration > 0:
            validas.append(lap_duration)

    return validas


def obtener_mejor_vuelta_piloto(session_key: int, driver_number: int):
    vueltas = obtener_vueltas_piloto(session_key, driver_number)
    vueltas_validas = extraer_vueltas_validas(vueltas)

    if not vueltas_validas:
        return None

    return min(vueltas_validas)


def obtener_mejor_vuelta_piloto_con_detalle(session_key: int, piloto_data: dict, compuesto_usuario=None):
    driver_number = piloto_data["driver_number"]
    mejor_vuelta = obtener_mejor_vuelta_piloto(session_key, driver_number)

    info_compuesto = resolver_compuesto_piloto(
        session_key,
        driver_number,
        compuesto_usuario,
        "mejor-tiempo"
    )

    datos_piloto = crear_piloto_resumen_base(piloto_data)
    datos_piloto["bonus_compuesto"] = info_compuesto["bonus_compuesto"]
    datos_piloto["compuesto_elegido"] = info_compuesto["compuesto_elegido"]
    datos_piloto["compuesto_real"] = info_compuesto["compuesto_real"]
    datos_piloto["acierto_compuesto"] = info_compuesto["acierto_compuesto"]

    if mejor_vuelta is not None:
        valor_final = mejor_vuelta + info_compuesto["bonus_compuesto"]
        datos_piloto["valor"] = round(valor_final, 3)
        datos_piloto["valido"] = True
    else:
        valor_final = mejor_vuelta - info_compuesto["bonus_compuesto"]
        datos_piloto["valor"] = None
        datos_piloto["valido"] = False

    return datos_piloto


def calcular_resultado_duelo(piloto_1, piloto_2, circuito_key: int, modo: str, compuesto_usuario=None):
    session_key = obtener_session_key_por_circuito(circuito_key)

    if modo == "carrera":
        detalle_1 = obtener_detalle_carrera_piloto(
            session_key, piloto_1, compuesto_usuario)
        detalle_2 = obtener_detalle_carrera_piloto(
            session_key, piloto_2, {})

        return {
            "valor_1": detalle_1["valor"],
            "valor_2": detalle_2["valor"],
            "detalle_1": detalle_1,
            "detalle_2": detalle_2,
        }

    if modo == "mejor-tiempo":
        detalle_1 = obtener_mejor_vuelta_piloto_con_detalle(
            session_key, piloto_1, compuesto_usuario)
        detalle_2 = obtener_mejor_vuelta_piloto_con_detalle(
            session_key, piloto_2, {})

        valor_1 = detalle_1["valor"]
        valor_2 = detalle_2["valor"]

        if valor_1 is None and valor_2 is None:
            raise DueloInvalidoException()

        return {
            "valor_1": valor_1,
            "valor_2": valor_2,
            "detalle_1": detalle_1,
            "detalle_2": detalle_2,
        }

    raise DueloInvalidoException()


def simular_duelo(usuario_id: int, modo: str, modo_rival: str, modo_circuito: str, driver_number_1: int, driver_number_2: int | None = None, circuito_key: int | None = None, compuesto_usuario=None):
    usuario = obtener_usuario_por_id(usuario_id)
    if not usuario:
        raise UsuarioNotFoundException()

    piloto_1 = obtener_piloto_por_driver_number(driver_number_1)
    if not piloto_1:
        raise RivalNoDisponibleException()

    piloto_2 = seleccionar_rival(modo_rival, driver_number_1, driver_number_2)
    circuito = seleccionar_circuito(modo_circuito, circuito_key)

    resultado_duelo = calcular_resultado_duelo(
        piloto_1,
        piloto_2,
        circuito["circuit_key"],
        modo,
        compuesto_usuario
    )

    valor_1 = resultado_duelo["valor_1"]
    valor_2 = resultado_duelo["valor_2"]
    detalle_1 = resultado_duelo["detalle_1"]
    detalle_2 = resultado_duelo["detalle_2"]

    if valor_1 is None or valor_2 is None:
        raise DueloInvalidoException()

    if modo == "carrera":
        if valor_1 >= valor_2:
            ganador = detalle_1["full_name"]
            ganador_usuario_id = usuario_id
        else:
            ganador = detalle_2["full_name"]
            ganador_usuario_id = None
    else:
        if valor_1 <= valor_2:
            ganador = detalle_1["full_name"]
            ganador_usuario_id = usuario_id
        else:
            ganador = detalle_2["full_name"]
            ganador_usuario_id = None

    diferencia = round(abs(valor_1 - valor_2), 3)

    duelo = Duelo(
        tipo_rival=modo_rival,
        modo=modo,
        driver_number_1=detalle_1["driver_number"],
        piloto1=detalle_1["full_name"],
        driver_number_2=detalle_2["driver_number"],
        piloto2=detalle_2["full_name"],
        circuito_key=circuito["circuit_key"],
        circuito=circuito["circuit_short_name"],
        ganador=ganador,
        tiempo_1=valor_1,
        tiempo_2=valor_2,
        diferencia=diferencia,
        ganador_usuario_id=ganador_usuario_id
    )

    duelo.usuarios.append(usuario)
    duelo = crear_duelo(duelo)

    return {
        "modo": modo,
        "tipo_rival": modo_rival,
        "modo_circuito": modo_circuito,
        "circuito": circuito,
        "piloto_1": detalle_1,
        "piloto_2": detalle_2,
        "resultado": {
            "ganador": ganador,
            "tiempo_1": valor_1,
            "tiempo_2": valor_2,
            "diferencia": diferencia,
            "ganador_usuario_id": ganador_usuario_id,
        },
        "duelo_guardado": crear_duelo_resumen(duelo),
    }


def listar_historial_duelos(usuario_id: int):
    usuario = obtener_usuario_por_id(usuario_id)
    if not usuario:
        raise UsuarioNotFoundException()

    duelos = obtener_duelos_usuario(usuario_id)

    historial = []
    for duelo in duelos:
        historial.append(crear_duelo_resumen(duelo))

    return historial


def eliminar_duelo_usuario(duelo_id: int, usuario_id: int):
    usuario = obtener_usuario_por_id(usuario_id)
    if not usuario:
        raise UsuarioNotFoundException()

    duelo = obtener_duelo_por_id(duelo_id)
    if not duelo:
        raise DueloNoEncontradoException()

    autorizado = any(usuario.id == usuario_id for usuario in duelo.usuarios)
    if not autorizado:
        raise DueloInvalidoException()

    eliminar_duelo(duelo)
    return True
