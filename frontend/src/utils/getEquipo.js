const equipos = import.meta.glob("../assets/logos_equipos/*.png", {
  eager: true,
});

export function getEquipo(team_name) {
  if (!team_name) return null;

  const key = `../assets/logos_equipos/${team_name}.png`;

  return equipos[key].default;
}