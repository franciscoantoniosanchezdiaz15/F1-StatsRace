from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import db


class Escuderia(db.Model):
    __tablename__ = "escuderias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)

    presupuesto_max = Column(Integer, nullable=False, default=0)
    coste_total = Column(Integer, nullable=False)

    usuario_id = Column(Integer, ForeignKey(
        "usuarios.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="escuderias")

    pilotos = relationship(
        "PilotoEscuderia", back_populates="escuderia", cascade="all, delete-orphan")
