const API_URL = "http://localhost:5000/api/pilotos";

export async function fetchPilotos(page = 1) {
  const response = await fetch(`${API_URL}?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo pilotos";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}