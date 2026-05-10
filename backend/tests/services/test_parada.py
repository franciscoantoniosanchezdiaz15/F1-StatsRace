import pytest

from app.services.parada_service import normalizar_paradas, calcular_bonus_paradas, resolver_paradas_piloto
from app.models.exceptions import DueloInvalidoException


def test_normalizar_paradas_correctas():
    assert normalizar_paradas("0") == 0
    assert normalizar_paradas("2") == 2
    assert normalizar_paradas(6) == 6


def test_normalizar_paradas_vacio():
    assert normalizar_paradas(None) is None
    assert normalizar_paradas("") is None


def test_normalizar_paradas_invalida_texto():
    with pytest.raises(DueloInvalidoException):
        normalizar_paradas("abc")


def test_normalizar_paradas_negativa():
    with pytest.raises(DueloInvalidoException):
        normalizar_paradas(-1)


def test_normalizar_paradas_mayor_6():
    with pytest.raises(DueloInvalidoException):
        normalizar_paradas(7)


def test_bonus_carrera_acierto():
    bonus, acierto = calcular_bonus_paradas(2, 2, "carrera")
    assert bonus == 2
    assert acierto is True


def test_bonus_carrera_fallo():
    bonus, acierto = calcular_bonus_paradas(1, 2, "carrera")
    assert bonus == -0.25
    assert acierto is False


def test_bonus_mejor_tiempo_acierto():
    bonus, acierto = calcular_bonus_paradas(2, 2, "mejor-tiempo")
    assert bonus == -0.25
    assert acierto is True


def test_bonus_mejor_tiempo_fallo():
    bonus, acierto = calcular_bonus_paradas(1, 2, "mejor-tiempo")
    assert bonus == 0.05
    assert acierto is False


def test_bonus_sin_datos_no_aplica():
    bonus, acierto = calcular_bonus_paradas(None, 2, "carrera")
    assert bonus == 0
    assert acierto is None


def test_resolver_paradas_nf_no_suma_ni_resta():
    resultado = resolver_paradas_piloto(
        session_key=9158,
        driver_number=44,
        paradas_elegidas=2,
        modo="carrera",
        piloto_valido=False,
    )

    assert resultado["paradas_elegidas"] == 2
    assert resultado["paradas_reales"] is None
    assert resultado["acierto_paradas"] is None
    assert resultado["bonus_paradas"] == 0
