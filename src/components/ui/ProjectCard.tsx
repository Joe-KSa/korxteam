import styles from "./styles/ProjectCard.module.scss";
import useDominantColor from "@/hooks/useDominantColor";
import { useProjects } from "@/hooks/useProjects";
import Button, {
  ButtonStyle,
  ButtonDirection,
  ButtonHoverStyle,
} from "../common/Button";
import { GithubIcon, ChainIcon } from "@/assets/icons";
import SkillTags from "../widget/SkillTags";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTextColor } from "@/utils/getTextColor";
import { getFileType  } from "@/utils/validateMedia";

const ProjectCard = () => {
  const { id } = useParams();
  const {
    setSelectedProject,
    projectBanner,
    selectedProject,
    setProjectDominantColor,
    projectDominantColor,
  } = useProjects(Number(id));
  const dominantColor = useDominantColor(selectedProject?.images?.url || "");

  useEffect(() => {
    if (dominantColor) {
      setProjectDominantColor(dominantColor);
    }
  }, [dominantColor]);

  const textColor = getTextColor(
    id ? dominantColor : projectDominantColor || ""
  );
  const typeFile = getFileType(projectBanner.images.url || "");

  return (
    <div className={styles.cardWrapper} key={projectBanner.id}>
      <div
        className={styles.cardWrapper__backgroundColor}
        style={{ backgroundColor: projectDominantColor || "" }}
      />
      <div className={styles.cardWrapper__mask}></div>
      <div className={styles.card}>
        <div className={styles.card__imageContainer}>
          {projectBanner.images?.url &&
            (typeFile === "video" ? (
              <video
                className={styles.card__imageContainer__img}
                autoPlay
                loop
                muted
              >
                <source src={projectBanner.images.url} />
              </video>
              
            ) : typeFile === "image" ? (
              <img
                src={projectBanner.images.url}
                alt={`Imagen del proyecto ${projectBanner.title}`}
                className={styles.card__imageContainer__img}
              />
            ) : null)}
        </div>

        {/* Se aplica el color de texto calculado al contenedor de información */}
        <div className={styles.infoContainer}>
          <div>
            <span
              onClick={() => setSelectedProject(projectBanner)}
              className={styles.infoContainer__titleContainer}
            >
              <h1 style={{ color: textColor }}>{projectBanner.title}</h1>
            </span>
            <span className={styles.infoContainer__descriptionContainer}>
              <div
                className={styles.infoContainer__descriptionContainer__creator}
              >
                <img src={projectBanner.creator.image} alt="" />
                <span style={{ color: textColor }}>
                  @{projectBanner.creator.username}
                </span>
              </div>
              <div
                className={styles.infoContainer__descriptionContainer__text}
                style={{ color: textColor }}
              >
                {projectBanner.description.slice(0, 150) + "..."}
              </div>
            </span>
            <SkillTags
              tags={projectBanner.tags.map((tag) => tag.name)}
              onlyIcon={true}
            />
          </div>

          {(projectBanner.repository || projectBanner.url) && (
            <div className={styles.buttons}>
              {projectBanner.repository && (
                <Button
                  styleType={ButtonStyle.ICON}
                  backgroundColor="var(--decorative-subdued)"
                  borderRadius="4px"
                  padding="10px 20px"
                  redirect
                  href={projectBanner.repository}
                  hoverStyleType={ButtonHoverStyle.SCALE}
                >
                  <GithubIcon className="medium-icon" />
                </Button>
              )}
              {projectBanner.url && (
                <Button
                  styleType={ButtonStyle.ICON_TEXT}
                  backgroundColor="var(--decorative-subdued)"
                  borderRadius="4px"
                  padding="10px 20px"
                  label="Ver más"
                  flexDirection={ButtonDirection.REVERSE}
                  iconMargin="0 0 0 10px"
                  redirect
                  href={projectBanner.url}
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

export default ProjectCard;
