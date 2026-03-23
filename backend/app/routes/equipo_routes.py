from app.models.exceptions import EquipoNoEncontradoException
from app.services.equipo_service import listar_equipos_client, obtener_equipo_por_nombre
from flask import Blueprint, jsonify, request

equipo_bp = Blueprint("equipos", __name__, url_prefix="/api/equipos")


@equipo_bp.route("", methods=["GET"])
def lista_equipos():
    try:
        page = request.args.get("page", default=1, type=int)
        limit = 4

        if page < 1:
            page = 1

        equipos = listar_equipos_client()

        total = len(equipos)
        total_pages = (total + limit - 1) // limit

        if total_pages > 0 and page > total_pages:
            page = total_pages

        start = (page - 1) * limit
        end = start + limit

        equipos_paginados = equipos[start:end]

        return jsonify({
            "ok": True,
            "data": {
                "equipos": equipos_paginados,
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
        print(f"Error en /api/equipos: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo equipos"
            }
        }), 500


@equipo_bp.route("/<path:team_name>", methods=["GET"])
def detalle_equipo(team_name):
    try:
        equipo = obtener_equipo_por_nombre(team_name)

        return jsonify({
            "ok": True,
            "data": {
                "equipo": equipo,
                "year": 2023
            }
        }), 200

    except EquipoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Equipo no encontrado"
            }
        }), 404

    except Exception as e:
        print(f"Error en /api/equipos/{team_name}: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo detalle del equipo"
            }
        }), 500
