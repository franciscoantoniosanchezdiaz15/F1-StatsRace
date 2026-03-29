from app.database.db import db
from app.models.escuderia import Escuderia
from app.models.piloto_escuderia import PilotoEscuderia


def obtener_escuderias_por_usuario(usuario_id: int):
    return Escuderia.query.filter_by(usuario_id=usuario_id).all()


def obtener_escuderia_por_id(escuderia_id: int):
    return Escuderia.query.filter_by(id=escuderia_id).first()


def obtener_escuderia_por_nombre_y_usuario(nombre: str, usuario_id: int):
    return Escuderia.query.filter_by(nombre=nombre, usuario_id=usuario_id).first()


def crear_escuderia(escuderia: Escuderia):
    db.session.add(escuderia)
    db.session.commit()

    return escuderia


def eliminar_escuderia(escuderia: Escuderia):
    db.session.delete(escuderia)
    db.session.commit()


def añadir_piloto_escuderia(piloto_escuderia: PilotoEscuderia):
    db.session.add(piloto_escuderia)
    db.session.commit()


def obtener_escuderias():
    return Escuderia.query.all()
