import styles from "./styles/ProjectCard.module.scss";
import type { getProjectProps } from "@/core/types";
import useDominantColor from "@/hooks/useDominatColor";
import { useProjects } from "@/hooks/useProjects";
import Button, { ButtonStyle, ButtonDirection, ButtonHoverStyle } from "../common/Button";
import { GithubIcon, ChainIcon } from "@/assets/icons";
import SkillTags from "../widget/SkillTags";

const ProjectCard: React.FC<{
  projectCardRef: React.RefObject<HTMLDivElement | null>;
}> = ({ projectCardRef }) => {
  const { projects, setSelectedProject, projectBanner } = useProjects();

  const dominantColor = useDominantColor(projectBanner?.images?.url);

  return (
    <div className={styles.container} ref={projectCardRef}>
      {projects.length > 0 && (
        <ProjectCardItem
          project={projectBanner}
          setSelectedProject={setSelectedProject}
          dominantColor={dominantColor}
        />
      )}
    </div>
  );
};

interface ProjectCardItemProps {
  project: getProjectProps;
  setSelectedProject: (project: getProjectProps) => void;
  dominantColor: string;
}

const ProjectCardItem = ({
  project,
  setSelectedProject,
  dominantColor,
}: ProjectCardItemProps) => {
  return (
    <div className={styles.cardWrapper} key={project.id}>
      <div
        className={styles.cardWrapper__backgroundColor}
        style={{ backgroundColor: dominantColor }}
      ></div>
      <div className={styles.cardWrapper__mask}></div>
      <div className={styles.card}>
        <div className={styles.card__imageContainer}>
          <img
            src={project.images?.url}
            alt={`Imagen del proyecto ${project.title}`}
            className={styles.card__imageContainer__img}
          />
        </div>
        <div className={styles.infoContainer}>
          <div>
            <span
              onClick={() => setSelectedProject(project)}
              className={styles.infoContainer__titleContainer}
            >
              <h1>{project.title}</h1>
            </span>
            <span className={styles.infoContainer__descriptionContainer}>
              <div className={styles.infoContainer__descriptionContainer__text}>
                {project.description.slice(0, 120) + "..."}
              </div>
            </span>
            <SkillTags
              tags={project.tags.map((tag) => tag.name)}
              onlyIcon={true}
            />
            {/* <span className={styles.infoContainer__state}>Activo</span> */}
          </div>

          <div className={styles.buttons}>
            <Button
              styleType={ButtonStyle.ICON}
              backgroundColor="var(--decorative-subdued)"
              borderRadius="4px"
              padding="10px 20px"
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

export default ProjectCard;
