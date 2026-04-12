import json

from app.config import Config
from app.services.ai.groq_client import get_groq_client
from app.services.circuito_service import obtener_circuito_por_key
from app.services.piloto_service import listar_pilotos_client, obtener_piloto_por_numero
from app.models.exceptions import CircuitoNoEncontradoException, PilotoNoEncontradoException, RivalNoDisponibleException, DueloInvalidoException


def recomendar_rival_por_circuito(circuito_key: int, driver_number_1: int):
    circuito = obtener_circuito_por_key(circuito_key)
    piloto_usuario = obtener_piloto_por_numero(driver_number_1)
    pilotos = listar_pilotos_client()

    if not pilotos:
        raise RivalNoDisponibleException()

    rivales = []
    for piloto in pilotos:
        if piloto.get("driver_number") != driver_number_1:
            rivales.append({
                "driver_number": piloto.get("driver_number"),
                "full_name": piloto.get("full_name"),
                "name_acronym": piloto.get("name_acronym"),
                "team_name": piloto.get("team_name"),
                "country_code": piloto.get("country_code"),
                "team_colour": piloto.get("team_colour"),
            })

    if not rivales:
        raise RivalNoDisponibleException()

    circuito_resumen = {
        "circuit_short_name": circuito.get("circuit_short_name"),
        "country_name": circuito.get("country_name"),
        "location": circuito.get("location"),
        "date_start": circuito.get("date_start"),
    }

    if not circuito_resumen:
        raise CircuitoNoEncontradoException()

    piloto_usuario_resumen = {
        "driver_number": piloto_usuario.get("driver_number"),
        "full_name": piloto_usuario.get("full_name"),
        "name_acronym": piloto_usuario.get("name_acronym"),
        "team_name": piloto_usuario.get("team_name"),
        "country_code": piloto_usuario.get("country_code")
    }

    if not piloto_usuario_resumen:
        raise PilotoNoEncontradoException()

    prompt = f"""
Eres un analista experto de Fórmula 1 especializado en crear duelos interesantes entre pilotos.

Tu tarea es recomendar el MEJOR RIVAL para el piloto del usuario en función del circuito elegido.

OBJETIVO:
- Elegir un rival realista e interesante para un duelo.
- Debe tener sentido por nivel competitivo, equipo, estilo esperado y atractivo del enfrentamiento.
- No elijas al mismo piloto del usuario.
- Responde únicamente con JSON válido en castellano.

CIRCUITO:
{json.dumps(circuito_resumen, ensure_ascii=False)}

PILOTO DEL USUARIO:
{json.dumps(piloto_usuario_resumen, ensure_ascii=False)}

RIVALES DISPONIBLES:
{json.dumps(rivales, ensure_ascii=False)}

Devuelve exactamente este JSON:
{{
  "driver_number": 0,
  "full_name": "Nombre del rival",
  "team_name": "Equipo",
  "motivo": "Explicación breve y clara de por qué este rival es ideal en este circuito para enfrentarse al piloto del usuario",
  "nivel_duelo": "bajo|medio|alto"
}}

No añadas markdown.
No añadas texto fuera del JSON.
No inventes pilotos fuera de la lista.
"""

    client = get_groq_client()

    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres una IA que solo devuelve JSON válido en castellano, "
                    "sin texto extra y sin markdown."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model=Config.GROQ_MODEL,
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content.strip()
    recomendacion = json.loads(content)

    driver_number_rival = recomendacion.get("driver_number")
    if driver_number_rival == driver_number_1:
        raise DueloInvalidoException()

    rival_valido = None
    for rival in rivales:
        if rival.get("driver_number") == driver_number_rival:
            rival_valido = rival
            break

    if not rival_valido:
        raise RivalNoDisponibleException()

    return {
        "circuito": circuito_resumen,
        "piloto_usuario": piloto_usuario_resumen,
        "rival_recomendado": {
            "driver_number": rival_valido.get("driver_number"),
            "full_name": rival_valido.get("full_name"),
            "team_name": rival_valido.get("team_name"),
            "motivo": recomendacion.get("motivo"),
            "nivel_duelo": recomendacion.get("nivel_duelo"),
        }
    }
