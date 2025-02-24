// Función para calcular el color de texto en base al color RGB del fondo.
export const getTextColor = (rgb: string) => {
  if (!rgb) return;
  const result = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!result) return "#fff";
  const r = parseInt(result[1], 10);
  const g = parseInt(result[2], 10);
  const b = parseInt(result[3], 10);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // Si la luminosidad es mayor a 128, se usa un texto oscuro (#121212)
  return brightness > 128 ? "#121212" : "";
};
