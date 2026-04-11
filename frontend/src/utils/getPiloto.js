const pilotos = import.meta.glob("../assets/pilotos/*.png", {
  eager: true,
});

export function getPilotos(full_name) {
  console.log(full_name)
  if (!full_name) return null;

  const key = `../assets/pilotos/${full_name}.png`;

  return pilotos[key].default;
}