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


def obtener_podium_por_session_key(session_key: int):
    resultados = client.fetch_session_resultados(session_key)

    if not resultados:
        return []

    pilotos = client.fetch_pilotos(session_key)
    mapa_pilotos = {}

    for p in pilotos:
        numero = p["driver_number"]
        mapa_pilotos[numero] = p

    podium = []

    for item in resultados:

        driver_number = item.get("driver_number")
        piloto_info = mapa_pilotos.get(driver_number, {})

        podium.append({
            "position": item.get("position"),
            "driver_number": item.get("driver_number"),
            "points": item.get("points"),
            "session_key": item.get("session_key"),

            "full_name": piloto_info.get("full_name"),
            "team_name": piloto_info.get("team_name")
        })

    return podium


def obtener_circuito_detalle_con_podium(circuito_key: int):
    circuito = obtener_circuito_por_key(circuito_key)
    session_key = circuito.get("session_key")

    podium = []
    if session_key:
        podium = obtener_podium_por_session_key(session_key)

    circuito["podium"] = podium
    return circuito
