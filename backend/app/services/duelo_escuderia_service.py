import random

from app.models.duelo_escuderia import DueloEscuderia
from app.models.escuderia import Escuderia
from app.models.exceptions import EscuderiaNoEncontradaException, EscuderiaNoAutorizadaException, CircuitoNoEncontradoException, RivalNoDisponibleException, DueloInvalidoException, DueloEscuderiaNoEncontradoException
from app.repositories.escuderia_repo import obtener_escuderia_por_id
from app.repositories.duelo_escuderia_repo import crear_duelo_escuderia, obtener_duelos_escuderia_usuario, obtener_duelo_escuderia_por_id, eliminar_duelo_escuderia
from app.services.circuito_service import listar_circuitos_client
from app.services.piloto_service import extraer_sessions_carrera
from app.clients.f1_client import OpenF1Client

client = OpenF1Client()
YEAR = 2023


def crear_duelo_escuderia_resumen(duelo: DueloEscuderia):
    return {
        "id": duelo.id,
        "tipo_rival": duelo.tipo_rival,
        "modo": duelo.modo,
        "year": YEAR,
        "circuito_key": duelo.circuito_key,
        "circuito": duelo.circuito,
        "escuderia_usuario_id": duelo.escuderia_usuario_id,
        "escuderia_rival_id": duelo.escuderia_rival_id,
        "escuderia_usuario_nombre": duelo.escuderia_usuario_nombre,
        "escuderia_rival_nombre": duelo.escuderia_rival_nombre,
        "ganador": duelo.ganador,
        "tiempo_usuario": duelo.tiempo_usuario,
        "tiempo_rival": duelo.tiempo_rival,
        "diferencia": duelo.diferencia,
        "usuario_id": duelo.usuario_id
    }


def crear_piloto_resumen_base(piloto):
    return {
        "driver_number": piloto.driver_number,
        "full_name": piloto.full_name,
        "team_name": piloto.team_name,
        "precio": piloto.precio,
    }


def crear_escuderia_resumen(escuderia):
    lista_pilotos = []
    for piloto in escuderia.pilotos:
        datos_piloto = crear_piloto_resumen_base(piloto)
        lista_pilotos.append(datos_piloto)

    return {
        "id": escuderia.id,
        "nombre": escuderia.nombre,
        "coste_total": escuderia.coste_total,
        "pilotos": lista_pilotos
    }


# sirve para calcular la media del equipo. Si los dos pilotos valen casi lo mismo tendran un pequeño bonus
def calcular_quimica_escuderia(escuderia):
    # Asi premiamos a equipos equilibrados y no a equipos con una estrella y otro q quede ultimo

    if not escuderia or not escuderia.pilotos or len(escuderia.pilotos) != 2:
        raise DueloInvalidoException()

    precio_piloto_1 = escuderia.pilotos[0].precio
    precio_piloto_2 = escuderia.pilotos[1].precio

    diferencia = abs(precio_piloto_1 - precio_piloto_2)

    puntos_base_bonus = 30 - diferencia
    puntos_ajustados = max(0, puntos_base_bonus)

    bonus_equilibrado = puntos_ajustados * 0.3

    return bonus_equilibrado


def aplicar_quimica_a_tiempo(tiempo: float, escuderia):
    quimica = calcular_quimica_escuderia(escuderia)
    tiempo_con_quimica = tiempo - quimica

    return tiempo_con_quimica


def seleccionar_rival(modo_rival: str, escuderia_usuario_id: int, escuderia_rival_id: int | None):
    if modo_rival == "manual":
        if not escuderia_rival_id:
            raise DueloInvalidoException()

        rival = obtener_escuderia_por_id(escuderia_rival_id)
        if not rival:
            raise EscuderiaNoEncontradaException()

        if rival.id == escuderia_usuario_id:
            raise DueloInvalidoException()

        return rival

    if modo_rival == "aleatorio":
        disponibles = Escuderia.query.filter(
            Escuderia.id != escuderia_usuario_id).all()

        if not disponibles:
            raise RivalNoDisponibleException()

        return random.choice(disponibles)

    raise DueloInvalidoException()


def seleccionar_circuito(modo_circuito: str, circuito_key: int | None):
    if modo_circuito == "manual":
        if not circuito_key:
            raise DueloInvalidoException()

        circuitos = listar_circuitos_client()
        for circuito in circuitos:
            if circuito["circuit_key"] == circuito_key:
                return circuito

        raise CircuitoNoEncontradoException()

    if modo_circuito == "aleatorio":
        circuitos = listar_circuitos_client()
        if not circuitos:
            raise CircuitoNoEncontradoException()

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


def obtener_driver_numbers_escuderia(escuderia):
    if not escuderia.pilotos or len(escuderia.pilotos) != 2:
        raise DueloInvalidoException()

    pilotos_numeros = []
    for piloto in escuderia.pilotos:
        numero = piloto.driver_number
        pilotos_numeros.append(numero)
    return pilotos_numeros


def obtener_resultados_pilotos(session_key: int, driver_numbers: list[int]):
    resultados = client.fetch_session_resultado_por_drivers(
        session_key, driver_numbers)
    if resultados is None:
        return []

    return resultados


def es_resultado_valido_carrera(resultado: dict):
    if not resultado:
        return False

    # Pq si es True significa que no acabo la carrera
    if resultado.get("dnf") or resultado.get("dns") or resultado.get("dsq"):
        return False

    puntos = resultado.get("points")
    if puntos is None:
        return False

    try:
        float(puntos)
        return True
    except (Exception):
        return False


def extraer_puntos_validos(resultados: list[dict]):
    puntos = []

    for resultado in resultados:
        if es_resultado_valido_carrera(resultado):
            try:
                puntos.append(float(resultado["points"]))
            except (Exception):
                continue

    return puntos


def obtener_lista_resultados_por_driver(resultados: list[dict]):
    lista = {}

    for resultado in resultados:
        driver_number = resultado.get("driver_number")
        if driver_number is not None:
            lista[driver_number] = resultado

    return lista


def obtener_detalle_carrera_escuderia(session_key: int, escuderia):
    driver_numbers = obtener_driver_numbers_escuderia(escuderia)
    resultados = obtener_resultados_pilotos(session_key, driver_numbers)
    lista_resultados = obtener_lista_resultados_por_driver(resultados)

    pilotos_detalle = []

    for piloto in escuderia.pilotos:
        resultado = lista_resultados.get(piloto.driver_number)

        puntos = 0.0
        valido = False

        if resultado and es_resultado_valido_carrera(resultado):
            try:
                puntos = float(resultado.get("points"))
                valido = True
            except (Exception):
                puntos = 0.0

        datos_piloto = crear_piloto_resumen_base(piloto)
        datos_piloto["valor"] = puntos
        datos_piloto["valido"] = valido

        if resultado:
            datos_piloto["position"] = resultado.get("position")
        else:
            datos_piloto["position"] = None

        pilotos_detalle.append(datos_piloto)

    bonus_quimica = float(calcular_quimica_escuderia(escuderia))

    total_sin_bonus = 0
    for p in pilotos_detalle:
        total_sin_bonus += p["valor"]

    valor_final = total_sin_bonus + bonus_quimica

    return {
        "id": escuderia.id,
        "nombre": escuderia.nombre,
        "coste_total": escuderia.coste_total,
        "bonus_quimica": round(bonus_quimica, 3),
        "valor_final": round(valor_final, 3),
        "pilotos": pilotos_detalle,
    }


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
        except (Exception):
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


def obtener_mejor_vuelta_piloto_con_detalle(session_key: int, piloto):
    mejor_vuelta = obtener_mejor_vuelta_piloto(
        session_key, piloto.driver_number)

    datos_piloto = crear_piloto_resumen_base(piloto)
    if mejor_vuelta is not None:
        datos_piloto["valor"] = round(mejor_vuelta, 3)
        datos_piloto["valido"] = True
    else:
        datos_piloto["valor"] = None
        datos_piloto["valido"] = False

    return datos_piloto


def obtener_detalle_mejor_tiempo_escuderia(session_key: int, escuderia):
    pilotos_detalle = []

    for piloto in escuderia.pilotos:
        pilotos_detalle.append(
            obtener_mejor_vuelta_piloto_con_detalle(session_key, piloto)
        )

    vueltas_validas = []
    for p in pilotos_detalle:
        if p["valor"] is not None:
            vueltas_validas.append(p["valor"])
        bonus_quimica = float(calcular_quimica_escuderia(escuderia))

    if vueltas_validas:
        mejor_base = sum(vueltas_validas)
        valor_final = aplicar_quimica_a_tiempo(mejor_base, escuderia)
    else:
        mejor_base = None
        valor_final = None

    resultado_final = {
        "id": escuderia.id,
        "nombre": escuderia.nombre,
        "coste_total": escuderia.coste_total,
        "bonus_quimica": round(bonus_quimica, 3),
        "valor_final": None,
        "pilotos": pilotos_detalle,
    }

    if valor_final is not None:
        resultado_final["valor_final"] = round(valor_final, 3)

    return resultado_final


def calcular_resultado_duelo(escuderia_usuario, escuderia_rival, circuito_key: int, modo: str):
    session_key = obtener_session_key_por_circuito(circuito_key)

    if modo == "carrera":
        detalle_usuario = obtener_detalle_carrera_escuderia(
            session_key, escuderia_usuario)
        detalle_rival = obtener_detalle_carrera_escuderia(
            session_key, escuderia_rival)

        return {
            "valor_usuario": detalle_usuario["valor_final"],
            "valor_rival": detalle_rival["valor_final"],
            "detalle_usuario": detalle_usuario,
            "detalle_rival": detalle_rival,
        }

    if modo == "mejor-tiempo":
        detalle_usuario = obtener_detalle_mejor_tiempo_escuderia(
            session_key, escuderia_usuario)
        detalle_rival = obtener_detalle_mejor_tiempo_escuderia(
            session_key, escuderia_rival)

        valor_usuario = detalle_usuario["valor_final"]
        valor_rival = detalle_rival["valor_final"]

        if valor_usuario is None and valor_rival is None:
            raise DueloInvalidoException()

        return {
            "valor_usuario": valor_usuario,
            "valor_rival": valor_rival,
            "detalle_usuario": detalle_usuario,
            "detalle_rival": detalle_rival,
        }

    raise DueloInvalidoException()


def simular_duelo_escuderias(usuario_id: int, modo: str, modo_rival: str, modo_circuito: str, escuderia_id_1: int, escuderia_id_2: int | None = None, circuito_key: int | None = None):
    escuderia_usuario = obtener_escuderia_por_id(escuderia_id_1)
    if not escuderia_usuario:
        raise EscuderiaNoEncontradaException()

    if escuderia_usuario.usuario_id != usuario_id:
        raise EscuderiaNoAutorizadaException()

    escuderia_rival = seleccionar_rival(
        modo_rival, escuderia_id_1, escuderia_id_2)
    circuito = seleccionar_circuito(modo_circuito, circuito_key)

    resultado_duelo = calcular_resultado_duelo(
        escuderia_usuario,
        escuderia_rival,
        circuito["circuit_key"],
        modo,
    )

    valor_usuario = resultado_duelo["valor_usuario"]
    valor_rival = resultado_duelo["valor_rival"]
    detalle_usuario = resultado_duelo["detalle_usuario"]
    detalle_rival = resultado_duelo["detalle_rival"]

    if modo == "carrera":
        # carrera -> puntos (mas gana)
        if valor_usuario >= valor_rival:
            ganador = escuderia_usuario.nombre
        else:
            ganador = escuderia_rival.nombre
    else:
        # mejor-tiempo -> segundos (menos gana)
        if valor_usuario <= valor_rival:
            ganador = escuderia_usuario.nombre
        else:
            ganador = escuderia_rival.nombre

    diferencia = round(abs(valor_usuario - valor_rival), 2)

    duelo = DueloEscuderia(
        tipo_rival=modo_rival,
        modo=modo,
        year=YEAR,
        circuito_key=circuito["circuit_key"],
        circuito=circuito["circuit_short_name"],
        escuderia_usuario_id=escuderia_usuario.id,
        escuderia_rival_id=escuderia_rival.id,
        escuderia_usuario_nombre=escuderia_usuario.nombre,
        escuderia_rival_nombre=escuderia_rival.nombre,
        ganador=ganador,
        tiempo_usuario=valor_usuario,
        tiempo_rival=valor_rival,
        diferencia=diferencia,
        usuario_id=usuario_id,
    )

    duelo = crear_duelo_escuderia(duelo)

    return {
        "modo": modo,
        "tipo_rival": modo_rival,
        "modo_circuito": modo_circuito,
        "circuito": circuito,
        "escuderia_usuario": detalle_usuario,
        "escuderia_rival": detalle_rival,
        "resultado": {
            "ganador": ganador,
            "tiempo_usuario": valor_usuario,
            "tiempo_rival": valor_rival,
            "diferencia": diferencia,
        },
        "duelo_guardado": crear_duelo_escuderia_resumen(duelo),
    }


def listar_historial_duelos_escuderia(usuario_id: int):
    duelos = obtener_duelos_escuderia_usuario(usuario_id)

    duelos_historial = []
    for duelo in duelos:
        crear_duelo = crear_duelo_escuderia_resumen(duelo)
        duelos_historial.append(crear_duelo)

    return duelos_historial


def eliminar_duelo_escuderia_usuario(duelo_id: int, usuario_id: int):
    duelo = obtener_duelo_escuderia_por_id(duelo_id)
    if not duelo:
        raise DueloEscuderiaNoEncontradoException()

    if duelo.usuario_id != usuario_id:
        raise EscuderiaNoAutorizadaException()

    eliminar_duelo_escuderia(duelo)
    return True
