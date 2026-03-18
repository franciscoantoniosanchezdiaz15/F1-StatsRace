from sqlalchemy import Column, Integer, ForeignKey
from app.database.db import db


class Participar(db.Model):
    __tablename__ = "participar"

    usuario_id = Column(Integer, ForeignKey(
        "usuarios.id", ondelete="CASCADE"), primary_key=True)

    duelo_id = Column(Integer, ForeignKey(
        "duelos.id", ondelete="CASCADE"), primary_key=True)
