from app.clients.f1_client import OpenF1Client
from app.models.exceptions import EquipoNoEncontradoException

client = OpenF1Client()

YEAR = 2023


def extraer_sessions_carrera():
    return client.fetch_carreras(YEAR)


def extraer_equipos_temporada():
    carreras = extraer_sessions_carrera()
    if not carreras:
        return None

    ultima_carrera = carreras[-1]
    session_key = ultima_carrera.get("session_key")
    if not session_key:
        return None

    equipos = client.fetch_equipos(session_key)
    if not equipos:
        return None

    equipos_adaptados = []

    for equipo in equipos:
        if not equipo:
            continue

        equipos_adaptados.append({
            "session_key": equipo.get("session_key"),
            "team_name": equipo.get("team_name"),
            "position_current": equipo.get("position_current"),
            "points_current": equipo.get("points_current")
        })

    return equipos_adaptados


def listar_equipos_client():
    equipos = extraer_equipos_temporada()
    if not equipos:
        return None

    return equipos


def obtener_equipo_por_nombre(team_name: str):
    equipos = listar_equipos_client()

    for equipo in equipos:
        if equipo["team_name"].lower() == team_name.lower():
            return equipo

    raise EquipoNoEncontradoException()
