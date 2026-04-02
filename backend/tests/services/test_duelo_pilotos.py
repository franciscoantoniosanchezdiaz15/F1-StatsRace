from unittest.mock import patch, MagicMock
from app.services.duelo_piloto_service import simular_duelo


def test_simular_duelo_pasa_compuesto_usuario():
    usuario_mock = MagicMock()
    usuario_mock.id = 1

    piloto_1 = {"driver_number": 1, "full_name": "Max Verstappen"}
    piloto_2 = {"driver_number": 11, "full_name": "Sergio Pérez"}
    circuito = {"circuit_key": 10, "circuit_short_name": "Monza"}

    resultado_mock = {
        "valor_1": 25.0,
        "valor_2": 18.0,
        "detalle_1": {
            "driver_number": 1,
            "full_name": "Max Verstappen"
        },
        "detalle_2": {
            "driver_number": 11,
            "full_name": "Sergio Pérez"
        }
    }

    duelo_guardado_mock = MagicMock()  # para simular Duelo con propiedades
    duelo_guardado_mock.id = 99
    duelo_guardado_mock.tipo_rival = "manual"
    duelo_guardado_mock.modo = "carrera"
    duelo_guardado_mock.driver_number_1 = 1
    duelo_guardado_mock.piloto1 = "Max Verstappen"
    duelo_guardado_mock.driver_number_2 = 11
    duelo_guardado_mock.piloto2 = "Sergio Pérez"
    duelo_guardado_mock.circuito_key = 10
    duelo_guardado_mock.circuito = "Monza"
    duelo_guardado_mock.ganador = "Max Verstappen"
    duelo_guardado_mock.tiempo_1 = 25.0
    duelo_guardado_mock.tiempo_2 = 18.0
    duelo_guardado_mock.diferencia = 7.0
    duelo_guardado_mock.ganador_usuario_id = 1
    duelo_guardado_mock.usuarios = []

    compuesto = {"compuesto": "SOFT"}

    with patch("app.services.duelo_piloto_service.obtener_usuario_por_id", return_value=usuario_mock), \
            patch("app.services.duelo_piloto_service.obtener_piloto_por_driver_number", return_value=piloto_1), \
            patch("app.services.duelo_piloto_service.seleccionar_rival", return_value=piloto_2), \
            patch("app.services.duelo_piloto_service.seleccionar_circuito", return_value=circuito), \
            patch("app.services.duelo_piloto_service.calcular_resultado_duelo", return_value=resultado_mock) as mock_calcular, \
            patch("app.services.duelo_piloto_service.crear_duelo", return_value=duelo_guardado_mock):

        resultado = simular_duelo(
            usuario_id=1,
            modo="carrera",
            modo_rival="manual",
            modo_circuito="manual",
            driver_number_1=1,
            driver_number_2=11,
            circuito_key=10,
            compuesto_usuario=compuesto
        )

        assert resultado["resultado"]["ganador"] == "Max Verstappen"
