from app.database.db import db
from app.models.duelo import Duelo
from app.models.usuario import Usuario


def crear_duelo(duelo: Duelo):
    db.session.add(duelo)
    db.session.commit()
    return duelo


def obtener_duelos_usuario(usuario_id: int):
    return (
        Duelo.query
        .join(Duelo.usuarios)
        .filter(Usuario.id == usuario_id)
        .order_by(Duelo.id.desc())
        .all()
    )


def obtener_duelo_por_id(duelo_id: int):
    return db.session.get(Duelo, duelo_id)


def eliminar_duelo(duelo: Duelo):
    db.session.delete(duelo)
    db.session.commit()
