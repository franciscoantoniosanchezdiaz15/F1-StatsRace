import { fetchMisEscuderias } from "./escuderiaService";
import { fetchCircuitos } from "./circuitoService";

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