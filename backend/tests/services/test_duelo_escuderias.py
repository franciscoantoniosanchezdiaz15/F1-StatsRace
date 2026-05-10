from unittest.mock import patch, MagicMock
from app.services.duelo_escuderia_service import simular_duelo_escuderias


def test_duelo_escuderias():
    escuderia_usuario = MagicMock()
    escuderia_usuario.id = 1
    escuderia_usuario.nombre = "Red Bull"
    escuderia_usuario.usuario_id = 1

    escuderia_rival = MagicMock()
    escuderia_rival.id = 2
    escuderia_rival.nombre = "Ferrari"

    circuito = {
        "circuit_key": 10,
        "circuit_short_name": "Monza"
    }

    resultado_mock = {
        "valor_usuario": 100,
        "valor_rival": 80,
        "detalle_usuario": {"nombre": "Red Bull"},
        "detalle_rival": {"nombre": "Ferrari"},
    }

    duelo_guardado_mock = MagicMock()
    duelo_guardado_mock.id = 99
    duelo_guardado_mock.tipo_rival = "manual"
    duelo_guardado_mock.modo = "carrera"
    duelo_guardado_mock.circuito_key = 10
    duelo_guardado_mock.circuito = "Monza"
    duelo_guardado_mock.escuderia_usuario_id = 1
    duelo_guardado_mock.escuderia_rival_id = 2
    duelo_guardado_mock.escuderia_usuario_nombre = "Red Bull"
    duelo_guardado_mock.escuderia_rival_nombre = "Ferrari"
    duelo_guardado_mock.ganador = "Red Bull"
    duelo_guardado_mock.tiempo_usuario = 100
    duelo_guardado_mock.tiempo_rival = 80
    duelo_guardado_mock.diferencia = 20
    duelo_guardado_mock.usuario_id = 1

    compuestos = {"1": "SOFT", "2": "MEDIUM"}
    paradas = {"1": 2, "11": 1}

    with patch("app.services.duelo_escuderia_service.obtener_escuderia_por_id", return_value=escuderia_usuario), \
            patch("app.services.duelo_escuderia_service.seleccionar_rival", return_value=escuderia_rival), \
            patch("app.services.duelo_escuderia_service.seleccionar_circuito", return_value=circuito), \
            patch("app.services.duelo_escuderia_service.calcular_resultado_duelo", return_value=resultado_mock) as mock_calcular, \
            patch("app.services.duelo_escuderia_service.crear_duelo_escuderia", return_value=duelo_guardado_mock):

        resultado = simular_duelo_escuderias(
            usuario_id=1,
            modo="carrera",
            modo_rival="manual",
            modo_circuito="manual",
            escuderia_id_1=1,
            escuderia_id_2=2,
            circuito_key=10,
            compuestos_usuario=compuestos,
            paradas_usuario=paradas
        )

        # comprobar ganador
        assert resultado["resultado"]["ganador"] == "Red Bull"

        # comprobar diferencia
        assert resultado["resultado"]["diferencia"] == 20

        # comprobar que devuelve estructura correcta
        assert resultado["duelo_guardado"]["id"] == 99
