from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import db


class PilotoEscuderia(db.Model):
    __tablename__ = "pilotos_escuderia"

    id = Column(Integer, primary_key=True, autoincrement=True)

    escuderia_id = Column(Integer, ForeignKey(
        "escuderias.id", ondelete="CASCADE"), nullable=False)

    driver_number = Column(Integer, nullable=False)
    full_name = Column(String(100), nullable=False)
    team_name = Column(String(100), nullable=False)
    precio = Column(Integer, nullable=False)

    escuderia = relationship("Escuderia", back_populates="pilotos")
