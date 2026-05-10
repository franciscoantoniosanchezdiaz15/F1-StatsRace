from unittest.mock import patch, MagicMock
from app.services.duelo_piloto_service import simular_duelo


def crear_duelo_guardado_mock():
    duelo = MagicMock()
    duelo.id = 99
    duelo.tipo_rival = "manual"
    duelo.modo = "carrera"
    duelo.driver_number_1 = 1
    duelo.piloto1 = "Max Verstappen"
    duelo.driver_number_2 = 11
    duelo.piloto2 = "Sergio Pérez"
    duelo.circuito_key = 10
    duelo.circuito = "Monza"
    duelo.ganador = "Max Verstappen"
    duelo.tiempo_1 = 25.0
    duelo.tiempo_2 = 18.0
    duelo.diferencia = 7.0
    duelo.ganador_usuario_id = 1
    duelo.usuarios = []
    return duelo


def test_simular_duelo_pilotos_carrera_pasa_compuesto_y_paradas():
    usuario_mock = MagicMock()
    usuario_mock.id = 1

    piloto_1 = {
        "driver_number": 1,
        "full_name": "Max Verstappen",
        "team_name": "Red Bull",
    }

    piloto_2 = {
        "driver_number": 11,
        "full_name": "Sergio Pérez",
        "team_name": "Red Bull",
    }

    circuito = {
        "circuit_key": 10,
        "circuit_short_name": "Monza",
    }

    resultado_mock = {
        "valor_1": 25.0,
        "valor_2": 18.0,
        "detalle_1": {
            "driver_number": 1,
            "full_name": "Max Verstappen",
            "team_name": "Red Bull",
            "valor": 25.0,
            "valido": True,
            "bonus_compuesto": 1.5,
            "compuesto_elegido": "SOFT",
            "compuesto_real": "SOFT",
            "acierto_compuesto": True,
            "bonus_paradas": 2,
            "paradas_elegidas": 2,
            "paradas_reales": 2,
            "acierto_paradas": True,
        },
        "detalle_2": {
            "driver_number": 11,
            "full_name": "Sergio Pérez",
            "team_name": "Red Bull",
            "valor": 18.0,
            "valido": True,
        },
    }

    compuesto = {"compuesto": "SOFT"}
    paradas = 2

    with patch(
        "app.services.duelo_piloto_service.obtener_usuario_por_id",
        return_value=usuario_mock,
    ), patch(
        "app.services.duelo_piloto_service.obtener_piloto_por_driver_number",
        return_value=piloto_1,
    ), patch(
        "app.services.duelo_piloto_service.seleccionar_rival",
        return_value=piloto_2,
    ), patch(
        "app.services.duelo_piloto_service.seleccionar_circuito",
        return_value=circuito,
    ), patch(
        "app.services.duelo_piloto_service.calcular_resultado_duelo",
        return_value=resultado_mock,
    ) as mock_calcular, patch(
        "app.services.duelo_piloto_service.crear_duelo",
        return_value=crear_duelo_guardado_mock(),
    ):

        resultado = simular_duelo(
            usuario_id=1,
            modo="carrera",
            modo_rival="manual",
            modo_circuito="manual",
            driver_number_1=1,
            driver_number_2=11,
            circuito_key=10,
            compuesto_usuario=compuesto,
            paradas_usuario=paradas,
        )

    assert resultado["resultado"]["ganador"] == "Max Verstappen"
    assert resultado["resultado"]["diferencia"] == 7.0
    assert resultado["resultado"]["ganador_usuario_id"] == 1
    assert resultado["duelo_guardado"]["id"] == 99

    mock_calcular.assert_called_once_with(
        piloto_1, piloto_2, 10, "carrera", compuesto, paradas)


def test_simular_duelo_pilotos_mejor_tiempo_gana_menor_valor():
    usuario_mock = MagicMock()
    usuario_mock.id = 1

    piloto_1 = {
        "driver_number": 44,
        "full_name": "Lewis Hamilton",
        "team_name": "Mercedes",
    }

    piloto_2 = {
        "driver_number": 1,
        "full_name": "Max Verstappen",
        "team_name": "Red Bull",
    }

    circuito = {
        "circuit_key": 10,
        "circuit_short_name": "Monza",
    }

    resultado_mock = {
        "valor_1": 82.100,
        "valor_2": 83.300,
        "detalle_1": {
            "driver_number": 44,
            "full_name": "Lewis Hamilton",
            "team_name": "Mercedes",
            "valor": 82.100,
            "valido": True,
        },
        "detalle_2": {
            "driver_number": 1,
            "full_name": "Max Verstappen",
            "team_name": "Red Bull",
            "valor": 83.300,
            "valido": True,
        },
    }

    duelo_guardado = MagicMock()
    duelo_guardado.id = 100
    duelo_guardado.tipo_rival = "manual"
    duelo_guardado.modo = "mejor-tiempo"
    duelo_guardado.driver_number_1 = 44
    duelo_guardado.piloto1 = "Lewis Hamilton"
    duelo_guardado.driver_number_2 = 1
    duelo_guardado.piloto2 = "Max Verstappen"
    duelo_guardado.circuito_key = 10
    duelo_guardado.circuito = "Monza"
    duelo_guardado.ganador = "Lewis Hamilton"
    duelo_guardado.tiempo_1 = 82.100
    duelo_guardado.tiempo_2 = 83.300
    duelo_guardado.diferencia = 1.2
    duelo_guardado.ganador_usuario_id = 1
    duelo_guardado.usuarios = []

    with patch(
        "app.services.duelo_piloto_service.obtener_usuario_por_id",
        return_value=usuario_mock,
    ), patch(
        "app.services.duelo_piloto_service.obtener_piloto_por_driver_number",
        return_value=piloto_1,
    ), patch(
        "app.services.duelo_piloto_service.seleccionar_rival",
        return_value=piloto_2,
    ), patch(
        "app.services.duelo_piloto_service.seleccionar_circuito",
        return_value=circuito,
    ), patch(
        "app.services.duelo_piloto_service.calcular_resultado_duelo",
        return_value=resultado_mock,
    ), patch(
        "app.services.duelo_piloto_service.crear_duelo",
        return_value=duelo_guardado,
    ):

        resultado = simular_duelo(
            usuario_id=1,
            modo="mejor-tiempo",
            modo_rival="manual",
            modo_circuito="manual",
            driver_number_1=44,
            driver_number_2=1,
            circuito_key=10,
            compuesto_usuario={"compuesto": "SOFT"},
            paradas_usuario=2,
        )

    assert resultado["resultado"]["ganador"] == "Lewis Hamilton"
    assert resultado["resultado"]["ganador_usuario_id"] == 1
    assert resultado["resultado"]["diferencia"] == 1.2
