from sqlalchemy import Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database.db import db


class Duelo(db.Model):
    __tablename__ = "duelos"

    id = Column(Integer, primary_key=True, autoincrement=True)

    tipo_rival = Column(String(20), nullable=False)  # manual o aleatorio
    modo = Column(String(20), nullable=False)  # carrera o vuelta rapida

    driver_number_1 = Column(Integer, nullable=False)
    piloto1 = Column(String(100), nullable=False)

    driver_number_2 = Column(Integer, nullable=False)
    piloto2 = Column(String(100), nullable=False)

    circuito_key = Column(Integer, nullable=False)
    circuito = Column(String(100), nullable=False)

    ganador = Column(String(100), nullable=True)

    tiempo_1 = Column(Float, nullable=True)
    tiempo_2 = Column(Float, nullable=True)
    diferencia = Column(Float, nullable=True)

    ganador_usuario_id = Column(Integer, ForeignKey(
        "usuarios.id", ondelete="SET NULL"), nullable=True)

    usuarios = relationship("Usuario", secondary="participar",
                            back_populates="duelos", passive_deletes=True)

    ganador_usuario = relationship(
        # para tener la relacion ORM para poder hacer duelo.ganador_usuario. Esto es pq duelo tiene dos relacions con usuario
        "Usuario", back_populates="duelos_ganados", foreign_keys=[ganador_usuario_id])
