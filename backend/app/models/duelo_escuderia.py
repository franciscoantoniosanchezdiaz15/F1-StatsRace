from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import db


class DueloEscuderia(db.Model):
    __tablename__ = "duelos_escuderia"

    id = Column(Integer, primary_key=True, autoincrement=True)
    modo = Column(String(50), nullable=False)

    year = Column(Integer, nullable=False)
    circuito = Column(String(100), nullable=False)

    escuderia_usuario_nombre = Column(String(100), nullable=False)
    escuderia_rival_nombre = Column(String(100), nullable=False)

    ganador = Column(String(100), nullable=True)

    usuario_id = Column(Integer, ForeignKey(
        "usuarios.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="duelos_escuderia")
