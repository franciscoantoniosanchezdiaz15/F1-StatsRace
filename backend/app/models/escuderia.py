from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import db


class Escuderia(db.Model):
    __tablename__ = "escuderias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)

    presupuesto_max = Column(Integer, nullable=False)
    coste_total = Column(Integer, nullable=False)

    piloto1_numero = Column(Integer, nullable=False)
    piloto1_nombre = Column(String(100), nullable=False)

    piloto2_numero = Column(Integer, nullable=False)
    piloto2_nombre = Column(String(100), nullable=False)

    usuario_id = Column(Integer, ForeignKey(
        "usuarios.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("Usuario", back_populates="escuderias")
