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
    throw new Error(data.error || "Error al registrar usuario");
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
    throw new Error(data.error || "Error al iniciar sesión");
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
    throw new Error(data.error || "Error al cerrar sesión");
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