from app.models.usuario import Usuario
from app.database.db import db


def crear_usuario(nombre, contraseña):
    usuario_nuevo = Usuario(nombre, contraseña)

    db.session.add(usuario_nuevo)
    db.session.commit()

    return usuario_nuevo


def obtener_usuario_por_nombre(nombre) -> Usuario | None:
    usuario = Usuario.query.filter_by(nombre=nombre).first()
    return usuario


def check_pass(usuario: Usuario, contraseña) -> bool:
    return usuario.check_password(contraseña)


def obtener_usuario_por_id(id) -> Usuario | None:
    usuario = db.session.get(Usuario, id)
    return usuario
