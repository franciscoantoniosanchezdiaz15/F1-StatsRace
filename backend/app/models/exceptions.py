class ContraseñaIncorrectaException(Exception):
    pass


class UsuarioExistenteException(Exception):
    pass


class UsuarioNoCreadoException(Exception):
    pass


class UsuarioNotFoundException(Exception):
    pass


class NoContraseña(Exception):
    pass


class ContraseñaCorta(Exception):
    pass


class ContraseñaNoValida(Exception):
    pass


class NoNombre(Exception):
    pass


class NombreNoValido(Exception):
    pass


class NombreLongitudInvalida(Exception):
    pass


class PilotoNoEncontradoException(Exception):
    pass


class CircuitoNoEncontradoException(Exception):
    pass


class EquipoNoEncontradoException(Exception):
    pass
