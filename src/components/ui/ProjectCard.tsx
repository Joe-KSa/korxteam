import styles from "./styles/ProjectCard.module.scss";
import useDominantColor from "@/hooks/useDominantColor";
import { useProjects } from "@/hooks/useProjects";
import { useLocation } from "react-router-dom";
import Button, {
  ButtonStyle,
  ButtonDirection,
  ButtonHoverStyle,
} from "../common/Button";
import { GithubIcon, ChainIcon } from "@/assets/icons";
import SkillTags from "../widget/SkillTags";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTextColor } from "@/utils/CheckColor";
import { getFileType } from "@/utils/validateMedia";
import { useNavigate } from "react-router-dom";
import DiscordLogo from "@/assets/DiscordLogo.jpg";

const ProjectCard = () => {
  const { id } = useParams();
  const {
    projectBanner,
    setProjectDominantColor,
    projectDominantColor,
    setShowComments,
  } = useProjects(Number(id));

  const dominantColor = useDominantColor(projectBanner.images.url);

  const location = useLocation();

  useEffect(() => {
    setProjectDominantColor(dominantColor);
  }, [location.pathname, dominantColor, setProjectDominantColor]);

  const textColor = getTextColor(
    id ? dominantColor ?? "" : projectDominantColor ?? ""
  );

  const typeFile = getFileType(projectBanner.images.url || "");

  const navigate = useNavigate();

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
                draggable={false}
              >
                <source src={projectBanner.images.url} />
              </video>
            ) : typeFile === "image" || "webp" ? (
              <img
                src={projectBanner.images.url}
                alt={`Imagen del proyecto ${projectBanner.title}`}
                draggable={false}
                className={styles.card__imageContainer__img}
              />
            ) : null)}
        </div>
        <div className={styles.infoContainer}>
          <div>
            <span
              onClick={() => {
                navigate(`/project/${projectBanner.id}`);
                setShowComments(true);
              }}
              className={styles.infoContainer__titleContainer}
            >
              <h1 style={{ color: textColor }}>{projectBanner.title}</h1>
            </span>
            <span className={styles.infoContainer__descriptionContainer}>
              <div
                className={styles.infoContainer__descriptionContainer__creator}
              >
                <img
                  draggable={false}
                  src={projectBanner.creator.image}
                  onError={(e) => {
                    e.currentTarget.src = DiscordLogo;
                    e.currentTarget.onerror = null;
                  }}
                />
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
              enableTooltip
            />
          </div>

          <div className={styles.buttons}>
            <Button
              styleType={ButtonStyle.ICON}
              backgroundColor="var(--decorative-subdued)"
              borderRadius="4px"
              padding="10px 20px"
              redirect={projectBanner.repository ? true : false}
              href={projectBanner.repository || ""}
              hoverStyleType={ButtonHoverStyle.SCALE}
              openInNewTab
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
              redirect={projectBanner.url ? true : false}
              href={projectBanner.url || ""}
              hoverStyleType={ButtonHoverStyle.SCALE}
              openInNewTab
            >
              <ChainIcon className="medium-icon" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
