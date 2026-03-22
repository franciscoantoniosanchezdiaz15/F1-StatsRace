const API_URL = "http://localhost:5000/api/circuitos";

export async function fetchCircuitos(page = 1) {
  const response = await fetch(`${API_URL}?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo circuitos";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function fetchCircuitoDetalle(circuitoKey) {
  const response = await fetch(`${API_URL}/${circuitoKey}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo detalle del circuito";
    
    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data.circuito;
}