from app.clients.f1_client import OpenF1Client
from app.models.exceptions import DueloInvalidoException

client = OpenF1Client()


def normalizar_compuesto(compuesto):
    if not compuesto:
        return None

    return str(compuesto).strip().upper()


def obtener_compuesto_piloto(session_key: int, driver_number: int):
    compuesto = client.fetch_neumaticos_por_driver(session_key, driver_number)

    if compuesto is None:
        return []

    return compuesto


def obtener_compuesto_real_piloto(session_key: int, driver_number: int):
    compuestos = obtener_compuesto_piloto(session_key, driver_number)

    if not compuestos:
        return None

    # pq en la api vienen 3 secciones en la que pueden variar el compuesto, nos quedamos con el priemro
    primer_compuesto = compuestos[0]
    compuesto_real = primer_compuesto.get("compound")

    return normalizar_compuesto(compuesto_real)


def calcular_bonus_compuesto(compuesto_elegido: str | None, compuesto_real: str | None, modo: str):
    compuesto_elegido = normalizar_compuesto(compuesto_elegido)
    compuesto_real = normalizar_compuesto(compuesto_real)

    if not compuesto_elegido or not compuesto_real:
        return 0.0, False

    if compuesto_elegido == compuesto_real:
        acierto = True
    else:
        acierto = False

    if modo == "carrera":
        if acierto:
            return 1.5, True
        return -0.75, False

    if modo == "mejor-tiempo":
        if acierto:
            return -0.4, True
        return 0.25, False

    raise DueloInvalidoException()


def resolver_compuesto_piloto(session_key: int, driver_number: int, compuesto_elegido: str | None, modo: str):
    compuesto_real = obtener_compuesto_real_piloto(session_key, driver_number)

    bonus_compuesto, acierto_compuesto = calcular_bonus_compuesto(
        compuesto_elegido,
        compuesto_real,
        modo
    )

    return {
        "compuesto_elegido": normalizar_compuesto(compuesto_elegido),
        "compuesto_real": compuesto_real,
        "acierto_compuesto": acierto_compuesto,
        "bonus_compuesto": bonus_compuesto
    }
