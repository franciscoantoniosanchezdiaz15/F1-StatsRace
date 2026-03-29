from app.models.escuderia import Escuderia
from app.models.piloto_escuderia import PilotoEscuderia
from app.repositories.escuderia_repo import obtener_escuderias_por_usuario, obtener_escuderia_por_id, obtener_escuderia_por_nombre_y_usuario, crear_escuderia, eliminar_escuderia, añadir_piloto_escuderia, obtener_escuderias
from app.models.exceptions import EscuderiaNoEncontradaException, PresupuestoInsuficienteException, PilotosDuplicadosException, NumeroPilotosInvalidoException, EscuderiaNoAutorizadaException, NombreEscuderiaDuplicadoException, NombreEscuderiaNoValidoException

from app.services.piloto_service import obtener_piloto_por_numero, listar_pilotos_client

PRESUPUESTO_BASE = 100


def adaptar_piloto_escuderia(piloto: PilotoEscuderia):
    return {
        "id": piloto.id,
        "driver_number": piloto.driver_number,
        "full_name": piloto.full_name,
        "team_name": piloto.team_name,
        "precio": piloto.precio,
    }


def adaptar_escuderia(escuderia: Escuderia):
    pilotos_adaptados = []
    for p in escuderia.pilotos:
        pilotos_adaptados.append(adaptar_piloto_escuderia(p))

    return {
        "id": escuderia.id,
        "nombre": escuderia.nombre,
        "presupuesto_max": escuderia.presupuesto_max,
        "coste_total": escuderia.coste_total,
        "usuario_id": escuderia.usuario_id,
        "pilotos": pilotos_adaptados,
    }


def calcular_precio_piloto(piloto: dict):
    team_name = (piloto.get("team_name")).lower()

    if "red bull" in team_name:
        return 80

    if "ferrari" in team_name or "mercedes" in team_name:
        return 55

    if "mclaren" in team_name or "aston martin" in team_name:
        return 40

    return 20


def obtener_pilotos_por_numero(driver_numbers: list):
    pilotos_encontrados = []

    for numero in driver_numbers:
        piloto = obtener_piloto_por_numero(numero)
        pilotos_encontrados.append(piloto)

    return pilotos_encontrados


def obtener_pilotos_disponibles_con_precio():
    pilotos = listar_pilotos_client()

    disponibles = []
    for piloto in pilotos:
        disponibles.append({
            "driver_number": piloto["driver_number"],
            "full_name": piloto["full_name"],
            "team_name": piloto["team_name"],
            "precio": calcular_precio_piloto(piloto),
            "headshot_url": piloto.get("headshot_url"),
            "name_acronym": piloto.get("name_acronym"),
            "country_code": piloto.get("country_code"),
            "team_colour": piloto.get("team_colour"),
        })

    return disponibles


def crear_escuderia_usuario(usuario_id: int, nombre: str, pilotos: list, presupuesto_max: int = PRESUPUESTO_BASE):
    nombre = (nombre).strip()

    if not nombre:
        raise NombreEscuderiaNoValidoException()

    escuderia_existente = obtener_escuderia_por_nombre_y_usuario(
        nombre, usuario_id)
    if escuderia_existente:
        raise NombreEscuderiaDuplicadoException()

    if len(pilotos) != 2:
        raise NumeroPilotosInvalidoException()

    pilotos_unicos = []
    for piloto in pilotos:
        if piloto not in pilotos_unicos:
            pilotos_unicos.append(piloto)

    if len(pilotos_unicos) != len(pilotos):
        raise PilotosDuplicadosException()

    pilotos_data = obtener_pilotos_por_numero(pilotos)

    pilotos_final = []
    coste_total = 0

    for piloto in pilotos_data:
        precio = calcular_precio_piloto(piloto)
        coste_total += precio

        pilotos_final.append({
            "driver_number": piloto["driver_number"],
            "full_name": piloto["full_name"],
            "team_name": piloto["team_name"],
            "precio": precio,
        })

    if coste_total > presupuesto_max:
        raise PresupuestoInsuficienteException()

    escuderia = Escuderia(
        nombre=nombre,
        presupuesto_max=presupuesto_max,
        coste_total=coste_total,
        usuario_id=usuario_id,
    )

    escuderia = crear_escuderia(escuderia)

    for piloto in pilotos_final:
        piloto_db = PilotoEscuderia(
            escuderia_id=escuderia.id,
            driver_number=piloto["driver_number"],
            full_name=piloto["full_name"],
            team_name=piloto["team_name"],
            precio=piloto["precio"],
        )
        añadir_piloto_escuderia(piloto_db)

    escuderia = obtener_escuderia_por_id(escuderia.id)
    return adaptar_escuderia(escuderia)


def listar_escuderias_usuario(usuario_id: int):
    escuderias = obtener_escuderias_por_usuario(usuario_id)

    escuderias_adaptadas = []
    for escuderia in escuderias:
        escuderias_adaptadas.append(adaptar_escuderia(escuderia))

    return escuderias_adaptadas


def obtener_detalle_escuderia_usuario(escuderia_id: int, usuario_id: int):
    escuderia = obtener_escuderia_por_id(escuderia_id)

    if not escuderia:
        raise EscuderiaNoEncontradaException()

    if escuderia.usuario_id != usuario_id:
        raise EscuderiaNoAutorizadaException()

    return adaptar_escuderia(escuderia)


def eliminar_escuderia_usuario(escuderia_id: int, usuario_id: int):
    escuderia = obtener_escuderia_por_id(escuderia_id)

    if not escuderia:
        raise EscuderiaNoEncontradaException()

    if escuderia.usuario_id != usuario_id:
        raise EscuderiaNoAutorizadaException()

    eliminar_escuderia(escuderia)
    return True


def listar_todas_escuderias():
    escuderias = obtener_escuderias()

    escuderias_adaptadas = []
    for escuderia in escuderias:
        escuderias_adaptadas.append(adaptar_escuderia(escuderia))

    return escuderias_adaptadas
