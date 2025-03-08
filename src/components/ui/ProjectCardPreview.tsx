import { useRef, useState } from "react";
import { projectProps } from "@/core/types";
import SkillTags from "../widget/SkillTags";
import styles from "./styles/ProjectCard.module.scss";
import { GithubIcon, ChainIcon } from "@/assets/icons";
import Button, {
  ButtonStyle,
  ButtonDirection,
  ButtonHoverStyle,
} from "../common/Button";
import { getTextColor } from "@/utils/CheckColor";
import { validateMediaFile, getFileType } from "@/utils/validateMedia";

interface ProjectCardPreviewProps {
  project: projectProps;
  onImageChange: (mediaUrl: string, file: File) => void;
  dominantColor: string;
}

const ProjectCardPreview: React.FC<ProjectCardPreviewProps> = ({
  project,
  onImageChange,
  dominantColor = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(
    project.images?.url || null
  );

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = await validateMediaFile(file, 5, 25);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    onImageChange(url, file);
  };

  const tags = project?.tags ?? [];
  const tagNames = tags.map((tag) => tag.name);
  const textColor = getTextColor(dominantColor);

  return (
    <div className={styles.cardWrapper}>
      <div
        className={styles.cardWrapper__backgroundColor}
        style={{ backgroundColor: dominantColor }}
      />
      <div className={styles.cardWrapper__mask}></div>
      <div className={styles.card}>
        <div
          className={styles.card__imageContainer}
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        >
          {project.images.url || mediaUrl ? (
            mediaType === "video" ||
            getFileType(project.images.url) === "video" ? (
              <video
                src={project.images.url || mediaUrl || ""}
                className={styles.card__imageContainer__img}
                autoPlay
                loop
                muted
              />
            ) : (
              <img
                src={project.images.url || mediaUrl || ""}
                className={styles.card__imageContainer__img}
              />
            )
          ) : (
            <div className={styles.card__imageContainer__img}></div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/mp4"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className={styles.infoContainer}>
          <div>
            <span className={styles.infoContainer__titleContainer}>
              <h1 style={{ color: textColor }}>{project.title}</h1>
            </span>
            <span className={styles.infoContainer__descriptionContainer}>
              <div
                className={styles.infoContainer__descriptionContainer__text}
                style={{ color: textColor }}
              >
                {project.description.slice(0, 150) + "..."}
              </div>
            </span>
            <SkillTags tags={tagNames} onlyIcon={true} />
          </div>

          <div className={styles.buttons}>
            <Button
              styleType={ButtonStyle.ICON}
              backgroundColor="var(--decorative-subdued)"
              borderRadius="4px"
              padding="10px 20px"
              redirect
              href={project.repository}
              hoverStyleType={ButtonHoverStyle.SCALE}
            >
              <GithubIcon className="medium-icon" />
            </Button>

            <Button
              styleType={ButtonStyle.ICON_TEXT}
              backgroundColor="var(--decorative-subdued)"
              borderRadius="4px"
              padding="10px 20px"
              label="Ver más"
              flexDirection={ButtonDirection.REVERSE}
              iconMargin="0 0 0 10px"
              redirect
              href={project.url}
              hoverStyleType={ButtonHoverStyle.SCALE}
            >
              <ChainIcon className="medium-icon" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardPreview;
