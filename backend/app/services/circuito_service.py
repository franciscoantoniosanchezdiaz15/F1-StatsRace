from app.clients.f1_client import OpenF1Client
from app.models.exceptions import CircuitoNoEncontradoException

client = OpenF1Client()

YEAR = 2023


def extraer_sessions_carrera():
    return client.fetch_carreras(YEAR)


def extraer_circuitos_temporada():
    carreras = extraer_sessions_carrera()
    if not carreras:
        return None

    circuitos = {}

    for carrera in carreras:
        if not carrera:
            continue

        circuito_key = carrera.get("circuit_key")
        if circuito_key is None:
            continue

        if circuito_key not in circuitos:
            circuitos[circuito_key] = {
                "circuit_key": circuito_key,
                "circuit_short_name": carrera.get("circuit_short_name"),
                "country_name": carrera.get("country_name"),
                "country_code": carrera.get("country_code"),
                "location": carrera.get("location"),
                "date_start": carrera.get("date_start"),
                "session_key": carrera.get("session_key")
            }

    return list(circuitos.values())


def listar_circuitos_client():
    circuitos = extraer_circuitos_temporada()
    if not circuitos:
        return None

    return circuitos


def obtener_circuito_por_key(circuito_key: int):
    circuitos = listar_circuitos_client()

    for circuito in circuitos:
        if circuito["circuit_key"] == circuito_key:
            return circuito

    raise CircuitoNoEncontradoException()
