const API_URL = "http://localhost:5000/api/auth";

export async function registerUser(usuario, contraseña) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ usuario, contraseña }),
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error al registrar usuario";

    if (data && data.error) {
      mensajeError = data.error;
    }

    throw new Error(mensajeError);
  }

  return data;
}

export async function loginUser(usuario, contraseña) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ usuario, contraseña }),
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError =  "Error al iniciar sesión";

    if (data && data.error) {
      mensajeError = data.error;
    }

    throw new Error(mensajeError);
  }

  return data;
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error al cerrar sesión";

    if (data && data.error) {
      mensajeError = data.error;
    }

    throw new Error(mensajeError);
  }

  return data;
}

export async function getCurrentUser() { //comprobar si se recarga que tengamos al usuario
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    return { authenticated: false, usuario: null };
  }

  return data;
}