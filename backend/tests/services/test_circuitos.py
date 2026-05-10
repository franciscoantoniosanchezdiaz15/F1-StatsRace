import pytest

from app.models.exceptions import CircuitoNoEncontradoException
from app.services.circuito_service import (
    extraer_sessions_carrera,
    extraer_circuitos_temporada,
    listar_circuitos_client,
    obtener_circuito_por_key,
    obtener_podium_por_session_key,
    obtener_circuito_detalle_con_podium,
)


def test_extraer_sessions_carrera(monkeypatch):
    from app.services import circuito_service

    carreras_fake = [
        {
            "session_key": 9158,
            "circuit_key": 10,
        }
    ]

    def fake_fetch_carreras(year):
        return carreras_fake

    monkeypatch.setattr(
        circuito_service.client,
        "fetch_carreras",
        fake_fetch_carreras,
    )

    resultado = extraer_sessions_carrera()

    assert resultado == carreras_fake


def test_extraer_circuitos_temporada_elimina_duplicados(monkeypatch):
    from app.services import circuito_service

    carreras = [
        {
            "circuit_key": 10,
            "circuit_short_name": "Monza",
            "country_name": "Italy",
            "country_code": "ITA",
            "location": "Monza",
            "date_start": "2023-09-03",
            "session_key": 9158,
        },
        {
            "circuit_key": 10,
            "circuit_short_name": "Monza",
            "country_name": "Italy",
            "country_code": "ITA",
            "location": "Monza",
            "date_start": "2023-09-03",
            "session_key": 9159,
        },
        {
            "circuit_key": 20,
            "circuit_short_name": "Silverstone",
            "country_name": "United Kingdom",
            "country_code": "GBR",
            "location": "Silverstone",
            "date_start": "2023-07-09",
            "session_key": 9000,
        },
        None,
        {
            "circuit_key": None,
        },
    ]

    def fake_extraer_sessions():
        return carreras

    monkeypatch.setattr(
        circuito_service,
        "extraer_sessions_carrera",
        fake_extraer_sessions,
    )

    resultado = extraer_circuitos_temporada()

    assert len(resultado) == 2

    assert resultado[0]["circuit_key"] == 10
    assert resultado[0]["circuit_short_name"] == "Monza"

    assert resultado[1]["circuit_key"] == 20
    assert resultado[1]["circuit_short_name"] == "Silverstone"


def test_extraer_circuitos_temporada_sin_carreras(monkeypatch):
    from app.services import circuito_service

    def fake_extraer_sessions():
        return []

    monkeypatch.setattr(
        circuito_service,
        "extraer_sessions_carrera",
        fake_extraer_sessions,
    )

    resultado = extraer_circuitos_temporada()

    assert resultado is None


def test_listar_circuitos_client(monkeypatch):
    from app.services import circuito_service

    circuitos = [
        {"circuit_key": 10, "circuit_short_name": "Monza"},
        {"circuit_key": 20, "circuit_short_name": "Silverstone"},
    ]

    def fake_extraer_circuitos():
        return circuitos

    monkeypatch.setattr(
        circuito_service,
        "extraer_circuitos_temporada",
        fake_extraer_circuitos,
    )

    resultado = listar_circuitos_client()

    assert resultado == circuitos


def test_listar_circuitos_client_sin_circuitos(monkeypatch):
    from app.services import circuito_service

    def fake_extraer_circuitos():
        return None

    monkeypatch.setattr(
        circuito_service,
        "extraer_circuitos_temporada",
        fake_extraer_circuitos,
    )

    resultado = listar_circuitos_client()

    assert resultado is None


def test_obtener_circuito_por_key(monkeypatch):
    from app.services import circuito_service

    circuitos = [
        {"circuit_key": 10, "circuit_short_name": "Monza"},
        {"circuit_key": 20, "circuit_short_name": "Silverstone"},
    ]

    def fake_listar():
        return circuitos

    monkeypatch.setattr(
        circuito_service,
        "listar_circuitos_client",
        fake_listar,
    )

    resultado = obtener_circuito_por_key(20)

    assert resultado["circuit_key"] == 20
    assert resultado["circuit_short_name"] == "Silverstone"


def test_obtener_circuito_por_key_no_existe(monkeypatch):
    from app.services import circuito_service

    circuitos = [
        {"circuit_key": 10, "circuit_short_name": "Monza"},
    ]

    def fake_listar():
        return circuitos

    monkeypatch.setattr(
        circuito_service,
        "listar_circuitos_client",
        fake_listar,
    )

    with pytest.raises(CircuitoNoEncontradoException):
        obtener_circuito_por_key(999)


def test_obtener_podium_por_session_key(monkeypatch):
    from app.services import circuito_service

    resultados_fake = [
        {
            "position": 1,
            "driver_number": 1,
            "points": 25,
            "session_key": 9158,
        },
        {
            "position": 2,
            "driver_number": 44,
            "points": 18,
            "session_key": 9158,
        },
    ]

    pilotos_fake = [
        {
            "driver_number": 1,
            "full_name": "Max Verstappen",
            "team_name": "Red Bull",
        },
        {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
            "team_name": "Mercedes",
        },
    ]

    def fake_fetch_resultados(session_key):
        return resultados_fake

    def fake_fetch_pilotos(session_key):
        return pilotos_fake

    monkeypatch.setattr(
        circuito_service.client,
        "fetch_session_resultados",
        fake_fetch_resultados,
    )

    monkeypatch.setattr(
        circuito_service.client,
        "fetch_pilotos",
        fake_fetch_pilotos,
    )

    resultado = obtener_podium_por_session_key(9158)

    assert len(resultado) == 2

    assert resultado[0]["position"] == 1
    assert resultado[0]["full_name"] == "Max Verstappen"

    assert resultado[1]["position"] == 2
    assert resultado[1]["full_name"] == "Lewis Hamilton"


def test_obtener_podium_por_session_key_sin_resultados(monkeypatch):
    from app.services import circuito_service

    def fake_fetch_resultados(session_key):
        return []

    monkeypatch.setattr(
        circuito_service.client,
        "fetch_session_resultados",
        fake_fetch_resultados,
    )

    resultado = obtener_podium_por_session_key(9158)

    assert resultado == []


def test_obtener_circuito_detalle_con_podium(monkeypatch):
    from app.services import circuito_service

    circuito_fake = {
        "circuit_key": 10,
        "circuit_short_name": "Monza",
        "session_key": 9158,
    }

    podium_fake = [
        {
            "position": 1,
            "driver_number": 1,
            "full_name": "Max Verstappen",
        }
    ]

    def fake_obtener_circuito(circuito_key):
        return circuito_fake.copy()

    def fake_obtener_podium(session_key):
        return podium_fake

    monkeypatch.setattr(
        circuito_service,
        "obtener_circuito_por_key",
        fake_obtener_circuito,
    )

    monkeypatch.setattr(
        circuito_service,
        "obtener_podium_por_session_key",
        fake_obtener_podium,
    )

    resultado = obtener_circuito_detalle_con_podium(10)

    assert resultado["circuit_key"] == 10
    assert resultado["podium"] == podium_fake


def test_obtener_circuito_detalle_sin_session_key(monkeypatch):
    from app.services import circuito_service

    circuito_fake = {
        "circuit_key": 10,
        "circuit_short_name": "Monza",
        "session_key": None,
    }

    def fake_obtener_circuito(circuito_key):
        return circuito_fake.copy()

    monkeypatch.setattr(
        circuito_service,
        "obtener_circuito_por_key",
        fake_obtener_circuito,
    )

    resultado = obtener_circuito_detalle_con_podium(10)

    assert resultado["podium"] == []
