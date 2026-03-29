const API_URL = "http://localhost:5000/api/escuderias";

export async function fetchPilotosDisponiblesEscuderia() {
  const response = await fetch(`${API_URL}/pilotos-disponibles`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo pilotos disponibles";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function crearEscuderia(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error creando escudería";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data.escuderia;
}

export async function fetchMisEscuderias() {
  const response = await fetch(`${API_URL}/mias`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo escuderías";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data.escuderias;
}

export async function fetchEscuderiaDetalle(escuderiaId) {
  const response = await fetch(`${API_URL}/${escuderiaId}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo detalle de la escudería";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data.escuderia;
}

export async function eliminarEscuderia(escuderiaId) {
  const response = await fetch(`${API_URL}/${escuderiaId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError ="Error eliminando escudería";


    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function fetchTodasEscuderias() {
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo escuderías";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data.escuderias;
}