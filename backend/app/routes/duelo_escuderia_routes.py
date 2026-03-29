from flask import Blueprint, jsonify, request, session

from app.services.duelo_escuderia_service import simular_duelo_escuderias, listar_historial_duelos_escuderia, eliminar_duelo_escuderia_usuario
from app.models.exceptions import EscuderiaNoEncontradaException, EscuderiaNoAutorizadaException, CircuitoNoEncontradoException, RivalNoDisponibleException, DueloInvalidoException, DueloEscuderiaNoEncontradoException

duelo_escuderia_bp = Blueprint(
    "duelos_escuderia", __name__, url_prefix="/api/duelos/escuderias")


@duelo_escuderia_bp.route("/carrera", methods=["POST"])
def duelo_carrera():
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

        resultado = simular_duelo_escuderias(
            usuario_id=usuario_id,
            modo="carrera",
            modo_rival=data.get("modo_rival"),
            modo_circuito=data.get("modo_circuito"),
            escuderia_id_1=data.get("escuderia_id_1"),
            escuderia_id_2=data.get("escuderia_id_2"),
            circuito_key=data.get("circuito_key"),
            compuestos_usuario=data.get("compuestos_usuario")
        )

        return jsonify({
            "ok": True,
            "data": resultado
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
                "message": "No puedes usar esta escudería"
            }
        }), 403

    except CircuitoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Circuito no encontrado"
            }
        }), 404

    except RivalNoDisponibleException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "No hay rival disponible"
            }
        }), 400

    except DueloInvalidoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Datos del duelo inválidos"
            }
        }), 400

    except Exception as e:
        print(f"Error en /duelos/escuderias/carrera: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error interno en duelo carrera"
            }
        }), 500


@duelo_escuderia_bp.route("/mejor-tiempo", methods=["POST"])
def duelo_mejor_tiempo():
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

        resultado = simular_duelo_escuderias(
            usuario_id=usuario_id,
            modo="mejor-tiempo",
            modo_rival=data.get("modo_rival"),
            modo_circuito=data.get("modo_circuito"),
            escuderia_id_1=data.get("escuderia_id_1"),
            escuderia_id_2=data.get("escuderia_id_2"),
            circuito_key=data.get("circuito_key"),
            compuestos_usuario=data.get("compuestos_usuario")
        )

        return jsonify({
            "ok": True,
            "data": resultado
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
                "message": "No puedes usar esta escudería"
            }
        }), 403

    except CircuitoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Circuito no encontrado"
            }
        }), 404

    except RivalNoDisponibleException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "No hay rival disponible"
            }
        }), 400

    except DueloInvalidoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Datos del duelo inválidos"
            }
        }), 400

    except Exception as e:
        print(f"Error en /duelos/escuderias/mejor-tiempo: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error interno en duelo mejor tiempo"
            }
        }), 500


@duelo_escuderia_bp.route("/historial", methods=["GET"])
def historial_duelos():
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {
                    "message": "Debes iniciar sesión"
                }
            }), 401

        historial = listar_historial_duelos_escuderia(usuario_id)

        return jsonify({
            "ok": True,
            "data": {
                "historial": historial
            }
        }), 200

    except Exception as e:
        print(f"Error en historial: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error obteniendo historial"
            }
        }), 500


@duelo_escuderia_bp.route("/historial/<int:duelo_id>", methods=["DELETE"])
def eliminar_duelo(duelo_id):
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {
                    "message": "Debes iniciar sesión"
                }
            }), 401

        eliminar_duelo_escuderia_usuario(duelo_id, usuario_id)

        return jsonify({
            "ok": True,
            "data": {
                "message": "Duelo eliminado correctamente"
            }
        }), 200

    except DueloEscuderiaNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "Duelo no encontrado"
            }
        }), 404

    except EscuderiaNoAutorizadaException:
        return jsonify({
            "ok": False,
            "error": {
                "message": "No tienes permiso"
            }
        }), 403

    except Exception as e:
        print(f"Error eliminando duelo: {e}")
        return jsonify({
            "ok": False,
            "error": {
                "message": "Error eliminando duelo"
            }
        }), 500
