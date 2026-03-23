from flask import Blueprint, jsonify, request
from app.services.circuito_service import listar_circuitos_client, obtener_circuito_por_key, obtener_circuito_detalle_con_podium
from app.models.exceptions import CircuitoNoEncontradoException

circuito_bp = Blueprint("circuitos", __name__, url_prefix="/api/circuitos")


@circuito_bp.route("", methods=["GET"])
def lista_circuitos():
    try:
        page = request.args.get("page", default=1, type=int)
        limit = 4

        if page < 1:
            page = 1

        circuitos = listar_circuitos_client()

        total = len(circuitos)
        total_pages = (total + limit - 1) // limit

        if total_pages > 0 and page > total_pages:
            page = total_pages

        start = (page - 1) * limit
        end = start + limit

        circuitos_paginados = circuitos[start:end]

        return jsonify({
            "ok": True,
            "data": {
                "circuitos": circuitos_paginados,
                "year": 2023,
                "paginacion": {
                    "page": page,
                    "limit": limit,
                    "total": total,
                    "total_pages": total_pages,
                    "siguiente": page < total_pages,
                    "anterior": page > 1
                }
            }
        }), 200

    except Exception as e:
        print(f"Error en /api/circuitos: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo circuitos"
            }
        }), 500


@circuito_bp.route("/<int:circuit_key>", methods=["GET"])
def detalle_circuito(circuit_key):
    try:
        circuito = obtener_circuito_detalle_con_podium(circuit_key)

        return jsonify({
            "ok": True,
            "data": {
                "circuito": circuito,
                "year": 2023
            }
        }), 200

    except CircuitoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Circuito no encontrado"
            }
        }), 404

    except Exception as e:
        print(f"Error en /api/circuitos/{circuit_key}: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo detalle del circuito"
            }
        }), 500
