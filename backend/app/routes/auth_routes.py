from flask import Blueprint, jsonify, request, session
from app.services.usuario_service import registrar_usuario, autenticar_usuario
from app.models.exceptions import (
    UsuarioExistenteException,
    UsuarioNoCreadoException,
    UsuarioNotFoundException,
    ContraseñaIncorrectaException,
    ContraseñaCorta,
    ContraseñaNoValida,
    NoContraseña,
    NombreNoValido,
    NombreLongitudInvalida,
    NoNombre
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No se han enviado datos"}), 400

    nombre = data.get("usuario")
    contraseña = data.get("contraseña")

    try:
        usuario = registrar_usuario(nombre, contraseña)

        session.clear()
        session["usuario"] = usuario.nombre
        session["usuario_id"] = usuario.id

        return jsonify({
            "message": "Usuario registrado correctamente",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre
            }
        }), 201

    except UsuarioExistenteException:
        return jsonify({"error": f"El usuario ya existe"}), 409

    except (UsuarioNoCreadoException,
            ContraseñaCorta,
            ContraseñaNoValida,
            NoContraseña,
            NombreNoValido,
            NombreLongitudInvalida,
            NoNombre):
        return jsonify({"error": "Datos de registro no válidos"}), 400

    except Exception:
        print("Error inesperado en register")
        return jsonify({"error": "Error interno del servidor"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No se han enviado datos"}), 400

    nombre = data.get("usuario")
    contraseña = data.get("contraseña")

    try:
        usuario = autenticar_usuario(nombre, contraseña)

        session.clear()
        session["usuario"] = usuario.nombre
        session["usuario_id"] = usuario.id

        return jsonify({
            "message": "Login correcto",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre
            }
        }), 200

    except (UsuarioNotFoundException, ContraseñaIncorrectaException):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    except Exception:
        print("Error inesperado en login")
        return jsonify({"error": "Error interno del servidor"}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Sesión cerrada correctamente"}), 200


@auth_bp.route("/me", methods=["GET"])
def me():
    usuario_id = session.get("usuario_id")
    nombre = session.get("usuario")

    if not usuario_id or not nombre:
        return jsonify({
            "authenticated": False,
            "usuario": None
        }), 401

    return jsonify({
        "authenticated": True,
        "usuario": {
            "id": usuario_id,
            "nombre": nombre
        }
    }), 200
