from app.repositories.usuario_repo import crear_usuario, obtener_usuario_por_nombre, check_pass
from app.models.exceptions import (UsuarioExistenteException,
                                   UsuarioNoCreadoException, UsuarioNotFoundException,
                                   ContraseñaIncorrectaException, ContraseñaCorta,
                                   ContraseñaNoValida, NoContraseña,
                                   NombreNoValido, NombreLongitudInvalida, NoNombre)


def registrar_usuario(nombre, contraseña):
    nombre_normalizado = normalizar_nombre(nombre)
    contraseña_valida = validar_contra(contraseña)

    existente = obtener_usuario_por_nombre(nombre_normalizado)
    if existente:
        raise UsuarioExistenteException()

    usuario = crear_usuario(nombre_normalizado, contraseña_valida)
    if not usuario:
        raise UsuarioNoCreadoException()

    return usuario


def autenticar_usuario(nombre, contraseña):
    nombre_normalizado = normalizar_nombre(nombre)

    usuario = obtener_usuario_por_nombre(nombre_normalizado)
    if not usuario:
        raise UsuarioNotFoundException()

    if contraseña is None or not contraseña.strip():
        raise ContraseñaIncorrectaException()

    if not check_pass(usuario, contraseña):
        raise ContraseñaIncorrectaException()

    return usuario


def validar_contra(contraseña: str) -> str:
    if contraseña is None:
        raise NoContraseña()

    contraseña = contraseña.strip()

    if not contraseña:
        raise ContraseñaNoValida()

    if len(contraseña) < 3:
        raise ContraseñaCorta()

    return contraseña


def normalizar_nombre(nombre: str) -> str:
    if nombre is None:
        raise NoNombre()

    nombre = nombre.strip()

    if not nombre:
        raise NombreNoValido()

    if len(nombre) < 3 or len(nombre) > 30:
        raise NombreLongitudInvalida()

    return nombre.lower()
