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

/**
 * Transforma un hex a un valor rgb.
 * @param hex Hex a transformar.
 * @returns Resultado de la tranformación.
 */

export const hexToRgb = (
  hex?: string
): { r: number; g: number; b: number } | null => {
  if (!hex) return null; // Verifica que hex tenga un valor
  const cleanedHex = hex.startsWith("#") ? hex.slice(1) : hex;
  if (cleanedHex.length !== 6) return null; // Verifica que tenga la longitud correcta

  const match = cleanedHex.match(/.{1,2}/g);
  if (!match) return null;

  return {
    r: parseInt(match[0], 16),
    g: parseInt(match[1], 16),
    b: parseInt(match[2], 16),
  };
};
