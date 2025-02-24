import { CloudinaryService } from "@/core/services/cloudinary/cloudinaryService";
import { SupabaseService } from "@/core/services/supabase/supabaseService";

export const ERROR_MESSAGES = {
  fieldsRequired: "Todos los campos son requeridos",
  uploadImageFailed: "Error al subir la imagen. Intenta nuevamente.",
  uploadAudioFailed: "Error al subir el audio. Intenta nuevamente.",
  updateProfileFailed: "Error al actualizar el perfil. Intenta nuevamente.",
  uploadProjectFailed: "Error al actualizar el project. Intenta nuevamente.",
};

export const handleImageUpload = async (
  imageFile: File | null,
  existingPublicId?: string
) => {
  if (!imageFile) return { url: "", publicId: existingPublicId || "" };
  if (existingPublicId)
    await new CloudinaryService().deleteImage(existingPublicId);
  const uploadResponse = await new CloudinaryService().uploadImage(imageFile);
  if (!uploadResponse?.url || !uploadResponse?.publicId)
    throw new Error(ERROR_MESSAGES.uploadImageFailed);
  return { url: uploadResponse.url, publicId: uploadResponse.publicId };
};

export const handleDeleteImage = async (publicId: string) => {
  await new CloudinaryService().deleteImage(publicId);
};

export const handleAudioUpload = async (
  audioFile: File | null,
  existingSoundPath?: string
) => {
  if (existingSoundPath) {
    await new SupabaseService().deleteAudio(existingSoundPath);
  }

  if (!audioFile) {
    return { soundUrl: "", soundPath: "" };
  }

  const uploadResponse = await new SupabaseService().uploadAudio(audioFile);

  if (!uploadResponse?.soundUrl || !uploadResponse?.soundPath) {
    throw new Error(ERROR_MESSAGES.uploadAudioFailed);
  }

  return {
    soundUrl: uploadResponse.soundUrl,
    soundPath: uploadResponse.soundPath,
  };
};
