from flask import Blueprint, jsonify, request, session

from app.services.duelo_piloto_service import (
    simular_duelo,
    listar_historial_duelos,
    eliminar_duelo_usuario
)

from app.models.exceptions import (
    CircuitoNoEncontradoException,
    RivalNoDisponibleException,
    DueloInvalidoException,
    DueloNoEncontradoException,
    UsuarioNotFoundException
)

duelo_piloto_bp = Blueprint(
    "duelos_piloto", __name__, url_prefix="/api/duelos/pilotos"
)


@duelo_piloto_bp.route("/carrera", methods=["POST"])
def duelo_carrera():
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {"message": "Debes iniciar sesión"}
            }), 401

        data = request.get_json()

        resultado = simular_duelo(
            usuario_id=usuario_id,
            modo="carrera",
            modo_rival=data.get("modo_rival"),
            modo_circuito=data.get("modo_circuito"),
            driver_number_1=data.get("driver_number_1"),
            driver_number_2=data.get("driver_number_2"),
            circuito_key=data.get("circuito_key"),
            compuesto_usuario=data.get("compuesto_usuario")
        )

        return jsonify({
            "ok": True,
            "data": resultado
        }), 200

    except UsuarioNotFoundException:
        return jsonify({
            "ok": False,
            "error": {"message": "Usuario no encontrado"}
        }), 404

    except CircuitoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {"message": "Circuito no encontrado"}
        }), 404

    except RivalNoDisponibleException:
        return jsonify({
            "ok": False,
            "error": {"message": "No hay rival disponible"}
        }), 400

    except DueloInvalidoException:
        return jsonify({
            "ok": False,
            "error": {"message": "Datos del duelo inválidos"}
        }), 400

    except Exception as e:
        print(f"Error en /duelos/pilotos/carrera: {e}")
        return jsonify({
            "ok": False,
            "error": {"message": "Error interno en duelo carrera"}
        }), 500


@duelo_piloto_bp.route("/mejor-tiempo", methods=["POST"])
def duelo_mejor_tiempo():
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {"message": "Debes iniciar sesión"}
            }), 401

        data = request.get_json()

        resultado = simular_duelo(
            usuario_id=usuario_id,
            modo="mejor-tiempo",
            modo_rival=data.get("modo_rival"),
            modo_circuito=data.get("modo_circuito"),
            driver_number_1=data.get("driver_number_1"),
            driver_number_2=data.get("driver_number_2"),
            circuito_key=data.get("circuito_key"),
            compuesto_usuario=data.get("compuesto_usuario")
        )

        return jsonify({
            "ok": True,
            "data": resultado
        }), 200

    except UsuarioNotFoundException:
        return jsonify({
            "ok": False,
            "error": {"message": "Usuario no encontrado"}
        }), 404

    except CircuitoNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {"message": "Circuito no encontrado"}
        }), 404

    except RivalNoDisponibleException:
        return jsonify({
            "ok": False,
            "error": {"message": "No hay rival disponible"}
        }), 400

    except DueloInvalidoException:
        return jsonify({
            "ok": False,
            "error": {"message": "Datos del duelo inválidos"}
        }), 400

    except Exception as e:
        print(f"Error en /duelos/pilotos/mejor-tiempo: {e}")
        return jsonify({
            "ok": False,
            "error": {"message": "Error interno en duelo mejor tiempo"}
        }), 500


@duelo_piloto_bp.route("/historial", methods=["GET"])
def historial_duelos():
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {"message": "Debes iniciar sesión"}
            }), 401

        historial = listar_historial_duelos(usuario_id)

        return jsonify({
            "ok": True,
            "data": {
                "historial": historial
            }
        }), 200

    except UsuarioNotFoundException:
        return jsonify({
            "ok": False,
            "error": {"message": "Usuario no encontrado"}
        }), 404

    except Exception as e:
        print(f"Error en historial pilotos: {e}")
        return jsonify({
            "ok": False,
            "error": {"message": "Error obteniendo historial"}
        }), 500


@duelo_piloto_bp.route("/historial/<int:duelo_id>", methods=["DELETE"])
def eliminar_duelo(duelo_id):
    try:
        usuario_id = session.get("usuario_id")
        if not usuario_id:
            return jsonify({
                "ok": False,
                "error": {"message": "Debes iniciar sesión"}
            }), 401

        eliminar_duelo_usuario(duelo_id, usuario_id)

        return jsonify({
            "ok": True,
            "data": {
                "message": "Duelo eliminado correctamente"
            }
        }), 200

    except UsuarioNotFoundException:
        return jsonify({
            "ok": False,
            "error": {"message": "Usuario no encontrado"}
        }), 404

    except DueloNoEncontradoException:
        return jsonify({
            "ok": False,
            "error": {"message": "Duelo no encontrado"}
        }), 404

    except DueloInvalidoException:
        return jsonify({
            "ok": False,
            "error": {"message": "No tienes permiso"}
        }), 403

    except Exception as e:
        print(f"Error eliminando duelo piloto: {e}")
        return jsonify({
            "ok": False,
            "error": {"message": "Error eliminando duelo"}
        }), 500
