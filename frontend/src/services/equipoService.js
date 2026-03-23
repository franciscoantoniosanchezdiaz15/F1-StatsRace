const API_URL = "http://localhost:5000/api/equipos";

export async function fetchEquipos(page = 1) {
  const response = await fetch(`${API_URL}?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo equipos";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function fetchEquipoDetalle(teamName) {
  const response = await fetch(`${API_URL}/${teamName}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo detalle del equipo";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data.equipo;
}