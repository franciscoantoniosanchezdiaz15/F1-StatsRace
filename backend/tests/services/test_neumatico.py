import pytest

from app.services.neumatico_service import (
    normalizar_compuesto,
    calcular_bonus_compuesto,
    obtener_compuesto_piloto,
    obtener_compuesto_real_piloto,
    resolver_compuesto_piloto,
)
from app.models.exceptions import DueloInvalidoException


def test_normalizar_compuesto():
    assert normalizar_compuesto("soft") == "SOFT"
    assert normalizar_compuesto(" Medium ") == "MEDIUM"
    assert normalizar_compuesto(None) is None
    assert normalizar_compuesto("") is None


def test_bonus_compuesto_carrera_acierto():
    bonus, acierto = calcular_bonus_compuesto("SOFT", "SOFT", "carrera")
    assert bonus == 1.5
    assert acierto is True


def test_bonus_compuesto_carrera_fallo():
    bonus, acierto = calcular_bonus_compuesto("SOFT", "HARD", "carrera")
    assert bonus == -0.75
    assert acierto is False


def test_bonus_compuesto_mejor_tiempo_acierto():
    bonus, acierto = calcular_bonus_compuesto(
        "MEDIUM",
        "MEDIUM",
        "mejor-tiempo",
    )
    assert bonus == -0.4
    assert acierto is True


def test_bonus_compuesto_mejor_tiempo_fallo():
    bonus, acierto = calcular_bonus_compuesto("SOFT", "HARD", "mejor-tiempo")
    assert bonus == 0.25
    assert acierto is False


def test_bonus_compuesto_sin_datos():
    bonus, acierto = calcular_bonus_compuesto(None, "SOFT", "carrera")
    assert bonus == 0.0
    assert acierto is False

    bonus, acierto = calcular_bonus_compuesto("SOFT", None, "carrera")
    assert bonus == 0.0
    assert acierto is False


def test_bonus_compuesto_modo_invalido():
    with pytest.raises(DueloInvalidoException):
        calcular_bonus_compuesto("SOFT", "SOFT", "modo-raro")


def test_obtener_compuesto_piloto_devuelve_lista(monkeypatch):
    from app.services import neumatico_service

    compuestos_fake = [
        {
            "compound": "SOFT",
        }
    ]

    def fake_fetch_neumaticos(session_key, driver_number):
        return compuestos_fake

    monkeypatch.setattr(
        neumatico_service.client,
        "fetch_neumaticos_por_driver",
        fake_fetch_neumaticos,
    )

    resultado = obtener_compuesto_piloto(9158, 44)

    assert resultado == compuestos_fake


def test_obtener_compuesto_piloto_api_none_devuelve_lista_vacia(monkeypatch):
    from app.services import neumatico_service

    def fake_fetch_neumaticos(session_key, driver_number):
        return None

    monkeypatch.setattr(
        neumatico_service.client,
        "fetch_neumaticos_por_driver",
        fake_fetch_neumaticos,
    )

    resultado = obtener_compuesto_piloto(9158, 44)

    assert resultado == []


def test_obtener_compuesto_real_piloto(monkeypatch):
    from app.services import neumatico_service

    compuestos_fake = [
        {
            "compound": "medium",
        },
        {
            "compound": "hard",
        },
    ]

    def fake_obtener_compuesto_piloto(session_key, driver_number):
        return compuestos_fake

    monkeypatch.setattr(
        neumatico_service,
        "obtener_compuesto_piloto",
        fake_obtener_compuesto_piloto,
    )

    resultado = obtener_compuesto_real_piloto(9158, 44)

    assert resultado == "MEDIUM"


def test_obtener_compuesto_real_sin_datos(monkeypatch):
    from app.services import neumatico_service

    def fake_obtener_compuesto_piloto(session_key, driver_number):
        return []

    monkeypatch.setattr(
        neumatico_service,
        "obtener_compuesto_piloto",
        fake_obtener_compuesto_piloto,
    )

    resultado = obtener_compuesto_real_piloto(9158, 44)

    assert resultado is None


def test_resolver_compuesto_piloto(monkeypatch):
    from app.services import neumatico_service

    def fake_obtener_compuesto_real_piloto(session_key, driver_number):
        return "SOFT"

    monkeypatch.setattr(
        neumatico_service,
        "obtener_compuesto_real_piloto",
        fake_obtener_compuesto_real_piloto,
    )

    resultado = resolver_compuesto_piloto(
        session_key=9158,
        driver_number=44,
        compuesto_elegido="soft",
        modo="carrera",
    )

    assert resultado["compuesto_elegido"] == "SOFT"
    assert resultado["compuesto_real"] == "SOFT"
    assert resultado["acierto_compuesto"] is True
    assert resultado["bonus_compuesto"] == 1.5
