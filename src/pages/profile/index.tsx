import { useEffect, useState } from "react";
import styles from "./styles/Profile.module.scss";
import InputField from "@/components/common/InputField";
import { useUser } from "@/hooks/useUser";
import { useMemberByUsername } from "@/hooks/useMemberByUsername";
import Button, {
  ButtonHoverStyle,
  ButtonStyle,
} from "@/components/common/Button";
import { postMemberProps, tagProps } from "@/core/types";
import { useMembers } from "@/hooks/useMembers";
import { useImageStore } from "@/store/store";
import HeaderProfile from "@/components/ui/HeaderProfile";
import { MemberService } from "../../core/services/member/memberService";
import { CloudinaryService } from "@/core/services/cloudinary/cloudinaryService";

const ERROR_MESSAGES = {
  fieldsRequired: "Todos los campos son requeridos",
  uploadFailed: "Error al subir la imagen. Intenta nuevamente.",
};

const ProfilePage = () => {
  const { user } = useUser();
  const { setSelectedMember } = useMembers();
  const { images, setImage } = useImageStore();

  const member = useMemberByUsername(user?.username);
  const [hasChanges, setHasChanges] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    github: "",
  });
  const [tags, setTags] = useState<tagProps[]>(member?.tags || []);

  // Carga de datos
  useEffect(() => {
    if (member) {
      setFormState({
        name: member.name,
        description: member.description,
        github: member.github,
      });
      setTags(member.tags);
    }
  }, [member]);

  // Verificar cambio de la data principal
  useEffect(() => {
    if (member) {
      const hasFormChanged =
        formState.name !== member.name ||
        formState.description !== member.description ||
        formState.github !== member.github;

        const hasImagesChanged = !!images.imageFile || !!images.bannerFile;


      const hasTagsChanged =
        JSON.stringify(tags.map((t) => t.id)) !==
        JSON.stringify(member.tags.map((t) => t.id));

      setHasChanges(hasFormChanged || hasTagsChanged || hasImagesChanged);
    }
  }, [formState, tags, member, images]);

  // Limpiar imágenes al salir de la página e interface
  useEffect(() => {
    return () => {
      if (images.imageUrl) URL.revokeObjectURL(images.imageUrl);
      if (images.bannerUrl) URL.revokeObjectURL(images.bannerUrl);
      setImage("image", null);
      setImage("banner", null);
      setSelectedMember(null);
    };
  }, []);

  // Input change
  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (newTags: tagProps[]) => {
    setTags(newTags);
  };

  const handleImageUpload = async (
    image: File | null,
    existingPublicId?: string
  ) => {
    if (!image) return { url: "", publicId: existingPublicId || "" };
    if (existingPublicId)
      await new CloudinaryService().deleteImage(existingPublicId);
    const uploadResponse = await new CloudinaryService().uploadImage(image);
    if (!uploadResponse?.url || !uploadResponse?.publicId)
      throw new Error(ERROR_MESSAGES.uploadFailed);
    return { url: uploadResponse.url, publicId: uploadResponse.publicId };
  };

  useEffect(() => {
    if (member) {
      setSelectedMember({
        ...member,
        ...formState,
        image: member.image || images.imageUrl || "",
        banner: member.banner || images.bannerUrl || "",
        tags,
      });
    }
  }, [
    formState,
    tags,
    member,
    images.imageUrl,
    images.bannerUrl,
    setSelectedMember,
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!member || !formState.name) {
      alert(ERROR_MESSAGES.fieldsRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const { url: imageUrl, publicId } = await handleImageUpload(
        images.imageFile,
        member?.publicId
      );
      const { url: bannerUrl, publicId: publicBannerId } =
        await handleImageUpload(images.bannerFile, member?.publicBannerId);

      const memberData: Pick<
        postMemberProps,
        | "name"
        | "description"
        | "tags"
        | "github"
        | "image"
        | "banner"
        | "publicId"
        | "publicBannerId"
      > = {
        name: formState.name,
        description: formState.description || "",
        // role: role.id,
        tags: tags.map((t) => t.id),
        image: imageUrl || "",
        publicId,
        banner: bannerUrl || "",
        publicBannerId,
        github: formState.github,
        // phrase: formState.phrase,
      };

      const response = await new MemberService().updateMember(
        member.id,
        memberData
      );

      if (response.success === true) {
        alert("El miembro ha sido actualizado con éxito.");
        setSelectedMember(null);
        setHasChanges(false);
      } else {
        throw new Error("Error al actualizar el miembro.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(ERROR_MESSAGES.uploadFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Controller form enter active disbled
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      // Evita el submit solo si el input no es un textarea
      if (event.target.type !== "textarea") {
        event.preventDefault();
      }
    }
  };

  const isDisabled = user?.writeAccess === 0;

  return (
    <div className={styles.container}>
      <div className={styles.presentation}>
        <h1>Profile</h1>
      </div>
      <div className={styles.headerProfileMobile}>
        <HeaderProfile maskId="mobileId" />
      </div>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className={styles.section}>
          <InputField
            type="text"
            value={formState.name}
            label="Nombre de usuario"
            htmlFor="name"
            disabled={isDisabled}
            maxLength={25}
            onChange={(value) => handleInputChange("name", value)}
          />
          <InputField
            type="textarea"
            maxLength={250}
            value={formState.description}
            label="Descripción"
            disabled={isDisabled}
            htmlFor="description"
            onChange={(value) => handleInputChange("description", value)}
          />
          <InputField
            type="text"
            value={formState.github}
            label="GitHub"
            htmlFor="github"
            disabled={isDisabled}
            maxLength={75}
            onChange={(value) => handleInputChange("github", value)}
          />
          <InputField
            label="Habilidades"
            type="skills"
            htmlFor="skills"
            disabled={isDisabled}
            maxLength={10}
            valueSkill={tags}
            onChangeSkill={(value) => handleTagsChange(value)}
          />
        </div>
        <div className={styles.containerButtons}>
          <Button
            styleType={ButtonStyle.TEXT_ONLY}
            type="submit"
            label="Guardar Cambios"
            backgroundColor="#202020"
            disabled={!hasChanges || isSubmitting || isDisabled}
            borderRadius="4px"
            hoverStyleType={ButtonHoverStyle.NORMAL}
          />
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
