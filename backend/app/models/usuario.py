from sqlalchemy import Column, Integer, String
from werkzeug.security import generate_password_hash, check_password_hash
from app.database.db import db


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), unique=True, nullable=False)
    contraseña = Column(String(20), nullable=False)

    def __init__(self, nombre, contraseña):
        self.nombre = nombre
        self.contraseña = generate_password_hash(contraseña)

    def check_Password(self, contraseña):
        return check_password_hash(self.contraseña, contraseña)
