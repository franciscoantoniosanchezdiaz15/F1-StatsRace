from app.clients.f1_client import OpenF1Client

client = OpenF1Client()

YEAR = 2023


def extraer_sessions_carrera():
    return client.fetch_carreras(YEAR)


def extraer_pilotos_por_carrera(session_key: int):
    return client.fetch_pilotos(session_key)


def extraer_pilotos_temporada():
    lista_carreras = extraer_sessions_carrera()
    if not lista_carreras:
        return None

    def clave_ordenacion(carrera):
        if carrera.get("date_start"):
            return carrera["date_start"]
        else:
            return ""

    lista_carreras.sort(key=clave_ordenacion)

    ultima_carrera = lista_carreras[-1]
    session_key = ultima_carrera.get("session_key")
    if not session_key:
        return None

    pilotos = extraer_pilotos_por_carrera(session_key)
    if not pilotos:
        return None

    return pilotos


def adaptar_pilotos(data):
    pilotos = {}

    for d in data:

        num = d.get("driver_number")
        if num is None:
            continue

        if num not in pilotos:
            pilotos[num] = {
                "driver_number": num,
                "full_name": d.get("full_name"),
                "name_acronym": d.get("name_acronym"),
                "team_name": d.get("team_name"),
                "country_code": d.get("country_code"),
                "headshot_url": d.get("headshot_url"),
                "team_colour": d.get("team_colour")
            }

    return list(pilotos.values())


def listar_pilotos_client():
    data = extraer_pilotos_temporada()
    pilotos = adaptar_pilotos(data)
    return pilotos
