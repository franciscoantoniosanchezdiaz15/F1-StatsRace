from app.clients.f1_client import OpenF1Client
from app.models.exceptions import DueloInvalidoException

client = OpenF1Client()


def normalizar_paradas(paradas):
    if paradas is None or paradas == "":
        return None

    try:
        paradas_int = int(paradas)
    except Exception:
        raise DueloInvalidoException()

    if paradas_int < 0 or paradas_int > 6:
        raise DueloInvalidoException()

    return paradas_int


def obtener_paradas_piloto(session_key: int, driver_number: int):
    paradas = client.fetch_paradas_por_driver(session_key, driver_number)

    if paradas is None:
        return []

    return paradas


def obtener_numero_paradas_real_piloto(session_key: int, driver_number: int):
    paradas = obtener_paradas_piloto(session_key, driver_number)
    return len(paradas)


def calcular_bonus_paradas(paradas_elegidas, paradas_reales, modo: str):
    paradas_elegidas = normalizar_paradas(paradas_elegidas)

    if paradas_elegidas is None or paradas_reales is None:
        return 0, None

    acierto = paradas_elegidas == paradas_reales

    if modo == "carrera":
        if acierto:
            return 2, True
        return -0.25, False

    if modo == "mejor-tiempo":
        if acierto:
            return -0.25, True
        return 0.05, False

    raise DueloInvalidoException()


def resolver_paradas_piloto(session_key: int, driver_number: int, paradas_elegidas, modo: str, piloto_valido: bool = True):
    if not piloto_valido:
        return {
            "paradas_elegidas": normalizar_paradas(paradas_elegidas),
            "paradas_reales": None,
            "acierto_paradas": None,
            "bonus_paradas": 0
        }

    paradas_reales = obtener_numero_paradas_real_piloto(
        session_key, driver_number)

    bonus_paradas, acierto_paradas = calcular_bonus_paradas(
        paradas_elegidas,
        paradas_reales,
        modo
    )

    return {
        "paradas_elegidas": normalizar_paradas(paradas_elegidas),
        "paradas_reales": paradas_reales,
        "acierto_paradas": acierto_paradas,
        "bonus_paradas": bonus_paradas
    }
