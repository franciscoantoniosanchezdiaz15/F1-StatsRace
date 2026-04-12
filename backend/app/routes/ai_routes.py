from flask import Blueprint, jsonify, request

from app.services.ai.recomendacion_piloto_service import recomendar_rival_por_circuito
from app.models.exceptions import CircuitoNoEncontradoException, PilotoNoEncontradoException, RivalNoDisponibleException, DueloInvalidoException

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ia")


@ai_bp.route("/recomendar-rival", methods=["POST"])
def recomendar_rival():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "ok": False,
                "error": {"message": "No se recibieron datos"}
            }), 400

        circuito_key = data.get("circuito_key")
        driver_number_1 = data.get("driver_number_1")

        if not circuito_key:
            return jsonify({
                "ok": False,
                "error": {"message": "circuito_key es obligatorio"}
            }), 400

        if not driver_number_1:
            return jsonify({
                "ok": False,
                "error": {"message": "driver_number_1 es obligatorio"}
            }), 400

        recomendacion = recomendar_rival_por_circuito(
            circuito_key=int(circuito_key),
            driver_number_1=int(driver_number_1)
        )

        return jsonify({
            "ok": True,
            "data": recomendacion
        }), 200

    except CircuitoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {"message": "Circuito no encontrado"}
        }), 404

    except PilotoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {"message": "Piloto no encontrado"}
        }), 404

    except RivalNoDisponibleException:
        return jsonify({
            "ok": False,
            "error": {"message": "No hay rival disponible"}
        }), 400

    except DueloInvalidoException:
        return jsonify({
            "ok": False,
            "error": {"message": "La recomendación generada no es válida"}
        }), 400

    except Exception as e:
        print(f"Error en /api/ia/recomendar-rival: {e}")
        return jsonify({
            "ok": False,
            "error": {"message": "Error generando recomendación IA"}
        }), 500
