import pytest

from app.models.exceptions import PilotoNoEncontradoException
from app.services.piloto_service import extraer_sessions_carrera, extraer_pilotos_por_carrera, extraer_pilotos_temporada, adaptar_pilotos, listar_pilotos_client, obtener_piloto_por_numero


def test_extraer_sessions_carrera(monkeypatch):
    from app.services import piloto_service

    carreras_fake = [
        {
            "session_key": 9158,
            "circuit_key": 10,
        }
    ]

    def fake_fetch_carreras(year):
        return carreras_fake

    monkeypatch.setattr(
        piloto_service.client,
        "fetch_carreras",
        fake_fetch_carreras,
    )

    resultado = extraer_sessions_carrera()

    assert resultado == carreras_fake


def test_extraer_pilotos_por_carrera(monkeypatch):
    from app.services import piloto_service

    pilotos_fake = [
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
        }
    ]

    def fake_fetch_pilotos(session_key):
        return pilotos_fake

    monkeypatch.setattr(
        piloto_service.client,
        "fetch_pilotos",
        fake_fetch_pilotos,
    )

    resultado = extraer_pilotos_por_carrera(9158)

    assert resultado == pilotos_fake


def test_extraer_pilotos_temporada(monkeypatch):
    from app.services import piloto_service

    carreras_fake = [
        {
            "session_key": 1111,
            "circuit_key": 1,
        },
        {
            "session_key": 2222,
            "circuit_key": 2,
        },
    ]

    pilotos_fake = [
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
        },
        {
            "driver_number": 1,
            "full_name": "Max Verstappen",
        },
    ]

    def fake_extraer_sessions_carrera():
        return carreras_fake

    def fake_extraer_pilotos_por_carrera(session_key):
        assert session_key == 2222
        return pilotos_fake

    monkeypatch.setattr(
        piloto_service,
        "extraer_sessions_carrera",
        fake_extraer_sessions_carrera,
    )

    monkeypatch.setattr(
        piloto_service,
        "extraer_pilotos_por_carrera",
        fake_extraer_pilotos_por_carrera,
    )

    resultado = extraer_pilotos_temporada()

    assert resultado == pilotos_fake


def test_extraer_pilotos_temporada_sin_carreras(monkeypatch):
    from app.services import piloto_service

    def fake_extraer_sessions_carrera():
        return []

    monkeypatch.setattr(
        piloto_service,
        "extraer_sessions_carrera",
        fake_extraer_sessions_carrera,
    )

    resultado = extraer_pilotos_temporada()

    assert resultado is None


def test_extraer_pilotos_temporada_sin_session_key(monkeypatch):
    from app.services import piloto_service

    carreras_fake = [
        {
            "session_key": None,
            "circuit_key": 1,
        }
    ]

    def fake_extraer_sessions_carrera():
        return carreras_fake

    monkeypatch.setattr(
        piloto_service,
        "extraer_sessions_carrera",
        fake_extraer_sessions_carrera,
    )

    resultado = extraer_pilotos_temporada()

    assert resultado is None


def test_extraer_pilotos_temporada_sin_pilotos(monkeypatch):
    from app.services import piloto_service

    carreras_fake = [
        {
            "session_key": 2222,
            "circuit_key": 2,
        },
    ]

    def fake_extraer_sessions_carrera():
        return carreras_fake

    def fake_extraer_pilotos_por_carrera(session_key):
        return []

    monkeypatch.setattr(
        piloto_service,
        "extraer_sessions_carrera",
        fake_extraer_sessions_carrera,
    )

    monkeypatch.setattr(
        piloto_service,
        "extraer_pilotos_por_carrera",
        fake_extraer_pilotos_por_carrera,
    )

    resultado = extraer_pilotos_temporada()

    assert resultado is None


def test_adaptar_pilotos_elimina_duplicados_y_sin_numero():
    data = [
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
            "name_acronym": "HAM",
            "team_name": "Mercedes",
            "country_code": "GBR",
            "headshot_url": "ham.png",
            "team_colour": "00D2BE",
        },
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton Duplicado",
            "name_acronym": "HAM",
            "team_name": "Mercedes",
            "country_code": "GBR",
            "headshot_url": "ham2.png",
            "team_colour": "00D2BE",
        },
        {
            "driver_number": None,
            "full_name": "Sin número",
        },
        {
            "driver_number": 1,
            "full_name": "Max Verstappen",
            "name_acronym": "VER",
            "team_name": "Red Bull",
            "country_code": "NED",
            "headshot_url": "ver.png",
            "team_colour": "3671C6",
        },
    ]

    resultado = adaptar_pilotos(data)

    assert len(resultado) == 2

    assert resultado[0]["driver_number"] == 44
    assert resultado[0]["full_name"] == "Lewis Hamilton"
    assert resultado[0]["name_acronym"] == "HAM"
    assert resultado[0]["team_name"] == "Mercedes"

    assert resultado[1]["driver_number"] == 1
    assert resultado[1]["full_name"] == "Max Verstappen"


def test_listar_pilotos_client(monkeypatch):
    from app.services import piloto_service

    pilotos_api = [
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
            "name_acronym": "HAM",
            "team_name": "Mercedes",
            "country_code": "GBR",
            "headshot_url": "ham.png",
            "team_colour": "00D2BE",
        }
    ]

    def fake_extraer_pilotos_temporada():
        return pilotos_api

    monkeypatch.setattr(
        piloto_service,
        "extraer_pilotos_temporada",
        fake_extraer_pilotos_temporada,
    )

    resultado = listar_pilotos_client()

    assert len(resultado) == 1
    assert resultado[0]["driver_number"] == 44
    assert resultado[0]["full_name"] == "Lewis Hamilton"


def test_obtener_piloto_por_numero_encontrado(monkeypatch):
    from app.services import piloto_service

    pilotos = [
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
        },
        {
            "driver_number": 1,
            "full_name": "Max Verstappen",
        },
    ]

    def fake_listar_pilotos_client():
        return pilotos

    monkeypatch.setattr(
        piloto_service,
        "listar_pilotos_client",
        fake_listar_pilotos_client,
    )

    resultado = obtener_piloto_por_numero(1)

    assert resultado["driver_number"] == 1
    assert resultado["full_name"] == "Max Verstappen"


def test_obtener_piloto_por_numero_no_encontrado(monkeypatch):
    from app.services import piloto_service

    pilotos = [
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
        },
    ]

    def fake_listar_pilotos_client():
        return pilotos

    monkeypatch.setattr(
        piloto_service,
        "listar_pilotos_client",
        fake_listar_pilotos_client,
    )

    with pytest.raises(PilotoNoEncontradoException):
        obtener_piloto_por_numero(1)
