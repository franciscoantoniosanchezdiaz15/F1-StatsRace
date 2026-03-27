from flask import Blueprint, jsonify, request, session
from app.services.escuderia_service import crear_escuderia_usuario, listar_escuderias_usuario, obtener_detalle_escuderia_usuario, eliminar_escuderia_usuario, obtener_pilotos_disponibles_con_precio
from app.models.exceptions import EscuderiaNoEncontradaException, PresupuestoInsuficienteException, PilotosDuplicadosException, NumeroPilotosInvalidoException, EscuderiaNoAutorizadaException, NombreEscuderiaDuplicadoException, PilotoNoEncontradoException, NombreEscuderiaNoValidoException

escuderia_bp = Blueprint("escuderias", __name__, url_prefix="/api/escuderias")


@escuderia_bp.route("/pilotos-disponibles", methods=["GET"])
def listar_pilotos_disponibles_route():
    try:
        pilotos = obtener_pilotos_disponibles_con_precio()

        return jsonify({
            "ok": True,
            "data": {
                "pilotos": pilotos,
                "presupuesto_max": 100
            }
        }), 200

    except Exception as e:
        print(f"Error en GET /api/escuderias/pilotos-disponibles: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo pilotos disponibles"
            }
        }), 500


@escuderia_bp.route("", methods=["POST"])
def crear_escuderia_route():
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {
                    "message": "Debes iniciar sesión"
                }
            }), 401

        data = request.get_json()
        nombre = data.get("nombre")
        pilotos = data.get("pilotos")

        escuderia = crear_escuderia_usuario(usuario_id, nombre, pilotos)

        return jsonify({
            "ok": True,
            "data": {
                "escuderia": escuderia
            }
        }), 201

    except NombreEscuderiaDuplicadoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Ya existe una escudería con ese nombre"
            }
        }), 409

    except NumeroPilotosInvalidoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Debes elegir exactamente 2 pilotos"
            }
        }), 400

    except PilotosDuplicadosException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "No puedes repetir piloto"
            }
        }), 400

    except PresupuestoInsuficienteException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "El coste total supera el presupuesto máximo"
            }
        }), 400

    except PilotoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Uno o más pilotos no existen"
            }
        }), 404

    except NombreEscuderiaNoValidoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "El nombre de la escudería es obligatorio"
            }
        }), 400

    except Exception as e:
        print(f"Error en POST /api/escuderias: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error creando escudería"
            }
        }), 500


@escuderia_bp.route("/mias", methods=["GET"])
def listar_mis_escuderias_route():
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {
                    "message": "Debes iniciar sesión"
                }
            }), 401

        escuderias = listar_escuderias_usuario(usuario_id)

        return jsonify({
            "ok": True,
            "data": {
                "escuderias": escuderias
            }
        }), 200

    except Exception as e:
        print(f"Error en GET /api/escuderias/mias: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo escuderías"
            }
        }), 500


@escuderia_bp.route("/<int:escuderia_id>", methods=["GET"])
def detalle_escuderia_route(escuderia_id):
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {
                    "message": "Debes iniciar sesión"
                }
            }), 401

        escuderia = obtener_detalle_escuderia_usuario(escuderia_id, usuario_id)

        return jsonify({
            "ok": True,
            "data": {
                "escuderia": escuderia
            }
        }), 200

    except EscuderiaNoEncontradaException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Escudería no encontrada"
            }
        }), 404

    except EscuderiaNoAutorizadaException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "No tienes permiso para ver esta escudería"
            }
        }), 403

    except Exception as e:
        print(f"Error en GET /api/escuderias/{escuderia_id}: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo escudería"
            }
        }), 500


@escuderia_bp.route("/<int:escuderia_id>", methods=["DELETE"])
def eliminar_escuderia_route(escuderia_id):
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {
                    "message": "Debes iniciar sesión"
                }
            }), 401

        eliminar_escuderia_usuario(escuderia_id, usuario_id)

        return jsonify({
            "ok": True,
            "data": {
                "message": "Escudería eliminada correctamente"
            }
        }), 200

    except EscuderiaNoEncontradaException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Escudería no encontrada"
            }
        }), 404

    except EscuderiaNoAutorizadaException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "No tienes permiso para eliminar esta escudería"
            }
        }), 403

    except Exception as e:
        print(f"Error en DELETE /api/escuderias/{escuderia_id}: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error eliminando escudería"
            }
        }), 500
