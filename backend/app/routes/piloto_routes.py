from flask import Blueprint, jsonify
from app.services.piloto_service import listar_pilotos_client

piloto_bp = Blueprint("pilotos", __name__, url_prefix="/api/pilotos")


@piloto_bp.route("", methods=["GET"])
def lista_pilotos():
    try:
        pilotos = listar_pilotos_client()

        return jsonify({
            "ok": True,
            "data": {
                "pilotos": pilotos,
                "year": 2023
            }
        }), 200

    except Exception as e:
        print(f"Error en /api/pilotos: {e}")

        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo pilotos"
            }
        }), 500
