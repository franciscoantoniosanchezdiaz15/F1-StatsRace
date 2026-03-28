import { fetchMisEscuderias } from "./escuderiaService";
import { fetchCircuitos } from "./circuitoService";

const API_URL = "http://localhost:5000/api/duelos/escuderias";


export async function fetchDatosDueloEscuderias() {
  const [escuderias, circuitosData] = await Promise.all([
    fetchMisEscuderias(),
    fetchCircuitos(1),
  ]);

  return {
    escuderias,
    circuitos: circuitosData.circuitos,
  };
}

export async function simularDueloEscuderiasCarrera(payload) {
  const response = await fetch(`${API_URL}/carrera`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error simulando duelo de escuderías";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function simularDueloEscuderiasMejorTiempo(payload) {
  const response = await fetch(`${API_URL}/mejor-tiempo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error simulando duelo de escuderías";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function fetchHistorialDuelosEscuderia() {
  const response = await fetch(`${API_URL}/historial`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error obteniendo historial";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data.historial;
}

export async function eliminarDueloEscuderia(dueloId) {
  const response = await fetch(`${API_URL}/historial/${dueloId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    let mensajeError = "Error eliminando duelo";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}