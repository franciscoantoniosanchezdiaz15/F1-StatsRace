import { fetchTodosPilotos } from "./pilotoService";
import { fetchTodosCircuitos } from "./circuitoService";

import { API_BASE } from "../config";

const API_URL = `${API_BASE}/api/duelos/pilotos`;

export async function fetchDatosDueloPilotos() {
  const [pilotos, circuitos] = await Promise.all([
    fetchTodosPilotos(),
    fetchTodosCircuitos(),
  ]);

  return {
    pilotos,
    circuitos
  };
}

export async function simularDueloPilotosCarrera(payload) {
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
    let mensajeError = "Error simulando duelo de pilotos";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function simularDueloPilotosMejorTiempo(payload) {
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
    let mensajeError = "Error simulando duelo de pilotos";

    if (data && data.error && data.error.message) {
      mensajeError = data.error.message;
    }

    throw new Error(mensajeError);
  }

  return data.data;
}

export async function fetchHistorialDuelosPilotos() {
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

export async function eliminarDueloPiloto(dueloId) {
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