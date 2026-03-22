const banderas = import.meta.glob("../assets/banderas/*.png", {
  eager: true,
});

export function getBandera(countryCode) {
  if (!countryCode) return null;

  const key = `../assets/banderas/${countryCode.toLowerCase()}.png`;

  return banderas[key].default;
}