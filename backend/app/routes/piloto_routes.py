from flask import Blueprint, jsonify, request
from app.services.piloto_service import listar_pilotos_client

piloto_bp = Blueprint("pilotos", __name__, url_prefix="/api/pilotos")


@piloto_bp.route("", methods=["GET"])
def lista_pilotos():
    try:
        page = request.args.get("page", default=1, type=int)
        limit = 4

        if page < 1:
            page = 1

        pilotos = listar_pilotos_client()

        total = len(pilotos)
        total_pages = (total + limit - 1) // limit

        if total_pages > 0 and page > total_pages:
            page = total_pages

        start = (page - 1) * limit
        end = start + limit

        # slicing poara conseguir los pilotos
        pilotos_paginados = pilotos[start:end]

        return jsonify({
            "ok": True,
            "data": {
                "pilotos": pilotos_paginados,
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
        print(f"Error en /api/pilotos: {e}")

        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo pilotos"
            }
        }), 500
