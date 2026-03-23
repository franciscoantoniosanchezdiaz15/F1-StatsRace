const circuitos = import.meta.glob("../assets/circuitos/*.jpeg", {
  eager: true,
});

export function getCircuito(circuit_key) {
  if (!circuit_key) return null;

  const key = `../assets/circuitos/${circuit_key}.jpeg`;

  return circuitos[key].default;
}