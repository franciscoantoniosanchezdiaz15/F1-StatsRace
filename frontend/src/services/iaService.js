import { API_BASE } from "../config";

const API_URL = `${API_BASE}/api/ia/recomendar-rival`;

export async function fetchRecomendacionRival(circuitoKey, driverNumber1) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      circuito_key: circuitoKey,
      driver_number_1: driverNumber1,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data?.error?.message || "Error obteniendo recomendación IA");
  }

  return data.data;
}