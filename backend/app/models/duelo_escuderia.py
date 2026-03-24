from sqlalchemy import Column, Float, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import db


class DueloEscuderia(db.Model):
    __tablename__ = "duelos_escuderia"

    id = Column(Integer, primary_key=True, autoincrement=True)

    tipo_rival = Column(String(20), nullable=False)  # manual o aleatorio
    modo = Column(String(50), nullable=False)

    year = Column(Integer, nullable=False)

    circuito_key = Column(Integer, nullable=False)
    circuito = Column(String(100), nullable=False)

    escuderia_usuario_id = Column(Integer, ForeignKey(
        "escuderias.id", ondelete="CASCADE"), nullable=False)

    escuderia_rival_id = Column(Integer, ForeignKey(
        "escuderias.id", ondelete="CASCADE"), nullable=False)

    escuderia_usuario_nombre = Column(String(100), nullable=False)
    escuderia_rival_nombre = Column(String(100), nullable=False)

    ganador = Column(String(100), nullable=True)

    tiempo_usuario = Column(Float, nullable=True)
    tiempo_rival = Column(Float, nullable=True)
    diferencia = Column(Float, nullable=True)

    usuario_id = Column(Integer, ForeignKey(
        "usuarios.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="duelos_escuderia")
