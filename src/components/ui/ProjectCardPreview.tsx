import { useRef } from "react";
import { projectProps } from "@/core/types";
import SkillTags from "../widget/SkillTags";
import styles from "./styles/ProjectCard.module.scss";
import { GithubIcon, ChainIcon } from "@/assets/icons";
import Button, {
  ButtonStyle,
  ButtonDirection,
  ButtonHoverStyle,
} from "../common/Button";
import { getTextColor } from "@/utils/getTextColor";

interface ProjectCardPreviewProps {
  project: projectProps;
  onImageChange: (imageUrl: string, file: File) => void;
  dominantColor: string;
}

const ProjectCardPreview: React.FC<ProjectCardPreviewProps> = ({
  project,
  onImageChange,
  dominantColor = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para abrir el selector de archivos
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Manejar el cambio de imagen
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Crear una URL local de la imagen
      onImageChange(imageUrl, file);
    }
  };

  const tags = project?.tags ?? [];
  const tagNames = (tags ?? []).map((tag) => tag.name);

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
          {project.images?.url ? (
            <img
              src={project.images?.url}
              className={styles.card__imageContainer__img}
            />
          ) : (
            <div className={styles.card__imageContainer__img}></div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
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
          </div>
          <SkillTags tags={tagNames} onlyIcon={true} />
          {(project.repository || project.url) && (
            <div className={styles.buttons}>
              {project.repository && (
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
              )}
              {project.url && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCardPreview;
