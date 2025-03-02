export interface MediaValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida un archivo multimedia según tamaño y duración máxima.
 * @param file Archivo a validar.
 * @param maxSizeMB Tamaño máximo en MB.
 * @param maxDurationSegundos Duración máxima en segundos (solo para videos).
 * @returns Resultado de la validación.
 */
export const validateMediaFile = (
  file: File,
  maxSizeMB = 7.5,
  maxDurationSegundos = 25
): Promise<MediaValidationResult> => {
  return new Promise((resolve) => {
    // Validar tamaño del archivo
    if (file.size > maxSizeMB * 1024 * 1024) {
      return resolve({
        valid: false,
        error: `El archivo no puede superar los ${maxSizeMB}MB.`,
      });
    }

    // Si es una imagen, no necesita validación de duración
    if (!file.type.startsWith("video")) {
      return resolve({ valid: true });
    }

    // Si es un video, validar duración
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src); // Liberar memoria
      if (video.duration > maxDurationSegundos) {
        return resolve({
          valid: false,
          error: `El video no puede superar los ${maxDurationSegundos} segundos.`,
        });
      }
      resolve({ valid: true });
    };
  });
};


export const getFileType = (url: string): "video" | "image" | "unknown" => {
  if (!url) return "unknown";

  if (/\.(mp4)$/i.test(url)) return "video";
  if (/\.(jpg|jpeg|png|gif)$/i.test(url)) return "image";

  return "unknown";
};
