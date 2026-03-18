from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from app.database.db import db


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(30), unique=True, nullable=False)
    contraseña = Column(String(500), nullable=False)

    duelos = relationship("Duelo", secondary="participar",
                          back_populates="usuarios", passive_deletes=True)

    duelos_ganados = relationship(
        "Duelo", back_populates="ganador_usuario", foreign_keys="Duelo.ganador_usuario_id")

    escuderias = relationship(
        "Escuderia", back_populates="usuario", passive_deletes=True)

    duelos_escuderia = relationship(
        "DueloEscuderia", back_populates="usuario", passive_deletes=True)

    def __init__(self, nombre, contraseña):
        self.nombre = nombre
        self.contraseña = generate_password_hash(contraseña)

    def check_password(self, contraseña):
        return check_password_hash(self.contraseña, contraseña)
