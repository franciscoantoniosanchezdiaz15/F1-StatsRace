from app.database.db import db
from app.models.duelo_escuderia import DueloEscuderia


def crear_duelo_escuderia(duelo: DueloEscuderia):
    db.session.add(duelo)
    db.session.commit()
    return duelo


def obtener_duelos_escuderia_usuario(usuario_id: int):
    return DueloEscuderia.query.filter_by(usuario_id=usuario_id).order_by(DueloEscuderia.id.desc()).all()


def obtener_duelo_escuderia_por_id(duelo_id: int):
    return db.session.get(DueloEscuderia, duelo_id)


def eliminar_duelo_escuderia(duelo: DueloEscuderia):
    db.session.delete(duelo)
    db.session.commit()
