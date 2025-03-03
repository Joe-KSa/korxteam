import { useEffect, useState, useRef } from "react";
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
import InputColor from "@/components/common/InputColor";
import InputAudio, { InputAudioRef } from "@/components/common/InputAudio";
import FormStyles from "@/components/common/styles/InputField.module.scss";
import { ERROR_MESSAGES, handleAudioUpload, handleImageUpload } from "@/utils/handleUpload";

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
    primaryColor: "",
    secondaryColor: "",
    phrase: "",
    sound: {
      url: "",
      path: "",
      type: "",
    },
  });
  const [tags, setTags] = useState<tagProps[]>(member?.tags || []);
  const inputSoundRef = useRef<InputAudioRef>(null);

  // Carga de datos
  useEffect(() => {
    if (member) {
      setFormState({
        name: member.name,
        description: member.description,
        github: member.github,
        primaryColor: member.primaryColor,
        secondaryColor: member.secondaryColor,
        phrase: member.phrase,
        sound: {
          url: member.sound.url,
          path: member.sound.path,
          type: member.sound.type,
        },
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
        formState.github !== member.github ||
        formState.primaryColor !== member.primaryColor ||
        formState.secondaryColor !== member.secondaryColor ||
        formState.phrase!== member.phrase ||
        formState.sound.url !== member.sound.url;

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

  const handleRemoveGradients = () => {
    setFormState((prev) => ({
      ...prev,
      primaryColor: "",
      secondaryColor: "",
    }));
  };


  const handleAudioChange = (url: string | null) => {
    setFormState((prev) => ({
      ...prev,
      sound: url ? { ...prev.sound, url } : { url: "", path: "", type: "" },
    }));
  };

  // Datos en tiempo real
  useEffect(() => {
    if (member) {
      setSelectedMember({
        ...member,
        ...formState,
        images: {
          avatar: {
            url: images.imageUrl || member?.images.avatar.url,
            publicId: images.imageUrl
              ? member?.images.avatar.publicId
              : member?.images.avatar.publicId,
          },
          banner: {
            url: images.bannerUrl || member?.images.banner.url,
            publicId: images.bannerUrl
              ? member?.images.banner.publicId
              : member?.images.banner.publicId,
          },
        },
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
    if (!member || !formState.name.trim()) {
      alert(ERROR_MESSAGES.fieldsRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const { url: avatarUrl, publicId: publicAvatarId } =
        await handleImageUpload(
          images.imageFile,
          member?.images.avatar.publicId
        );
      const { url: bannerUrl, publicId: publicBannerId } =
        await handleImageUpload(
          images.bannerFile,
          member?.images.banner.publicId
        );

      const audioFile = inputSoundRef.current?.getFile() || null;

      const audioUpload = audioFile
        ? await handleAudioUpload(audioFile, member?.sound.path)
        : {
            soundUrl: member?.sound.url || "",
            soundPath: member?.sound.path || "",
          };

      const memberData: Pick<
        postMemberProps,
        | "name"
        | "description"
        | "tags"
        | "github"
        | "primaryColor"
        | "secondaryColor"
        | "sound"
        | "images"
        | "phrase"
      > = {
        name: formState.name,
        description: formState.description || "",
        tags: tags.map((t) => t.id),
        images: {
          avatar: {
            url: avatarUrl,
            publicId: publicAvatarId,
          },
          banner: {
            url: bannerUrl,
            publicId: publicBannerId,
          },
        },
        phrase: formState.phrase,
        github: formState.github,
        primaryColor: formState.primaryColor,
        secondaryColor: formState.secondaryColor,
        sound: {
          url: audioUpload?.soundUrl || "",
          path: audioUpload?.soundPath || "",
          type: "general",
        },
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
      alert(ERROR_MESSAGES.updateProfileFailed);
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

  const isDisabled = user?.role.name === "Bloqueado";

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
            value={formState.phrase}
            label="Frase"
            htmlFor="phrase"
            disabled={isDisabled}
            optional
            maxLength={70}
            onChange={(value) => handleInputChange("phrase", value)}
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
            label="Tecnologias"
            type="skills"
            htmlFor="skills"
            disabled={isDisabled}
            maxLength={10}
            valueSkill={tags}
            onChangeSkill={(value) => handleTagsChange(value)}
          />

          <div className={styles.section}>
            <div className={FormStyles.labelSection}>
              <label className={FormStyles.labelSection__label}>
                <span>Audio</span>
              </label>
            </div>
            <div className={styles.section__tools}>
              <InputAudio
                ref={inputSoundRef}
                soundUrl={member?.sound.url}
                onChange={handleAudioChange}
              />
              <div className={styles.section__tools__inputColor}>
                <InputColor
                  onChange={(value) => handleInputChange("primaryColor", value)}
                  disabled={isDisabled}
                  defaultColor={formState.primaryColor || "#ffffff"}
                  text="Primario"
                />
                <InputColor
                  onChange={(value) =>
                    handleInputChange("secondaryColor", value)
                  }
                  disabled={isDisabled}
                  defaultColor={formState.secondaryColor || "#000000"}
                  text="Secundario"
                />
              </div>
            </div>
          </div>
          <div className={styles.section__buttons}>
            <Button
              styleType={ButtonStyle.TEXT_ONLY}
              label="Restablecer Colores"
              fontSize="12px"
              borderRadius="4px"
              backgroundColor="var(--decorative-subdued)"
              onClick={handleRemoveGradients}
            />
            <Button
              onClick={() => inputSoundRef.current?.clearAudio()}
              label="Restablecer audio"
              fontSize="12px"
              styleType={ButtonStyle.TEXT_ONLY}
              backgroundColor="var(--decorative-subdued)"
              borderRadius="4px"
              padding="10px 20px"
            />
          </div>
        </div>

        <div className={styles.SaveButton}>
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
