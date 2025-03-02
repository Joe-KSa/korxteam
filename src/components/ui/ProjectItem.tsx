import React, { useState } from "react";
import styles from "./styles/ProjectItem.module.scss";
import { getProjectProps } from "@/core/types";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { EditIcon, ShowIcon, HideIcon } from "@/assets/icons";
import { ProjectService } from "@/core/services/project/projectService";
import { useProjects } from "@/hooks/useProjects";
import { getFileType } from "@/utils/validateMedia";

interface ProjectItem {
  project: getProjectProps;
  setSelectedProject: () => void;
}

const ProjectItem: React.FC<ProjectItem> = ({
  project,
  setSelectedProject,
}) => {
  const { user } = useUser();
  const { projects, setProjects } = useProjects();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEditingProject = (project: getProjectProps) => {
    setSelectedProject();
    navigate(`/project/${project?.id}/edit`);
  };

  const handleVisibilityChange = async (hidden: boolean) => {
    try {
      await new ProjectService().updateProjectVisibility(project.id, hidden);
      setProjects(
        projects.map((p) => (p.id === project.id ? { ...p, hidden } : p))
      );
    } catch (error) {
      console.error("Error changing visibility:", error);
    }
  };

  const typeFile = getFileType(project.images.url || "");

  return (
    <li className={styles.container}>
      <div
        className={styles.imageContainer}
        onClick={setSelectedProject}
        onMouseEnter={() => setIsPlaying(true)}
        onMouseLeave={() => setIsPlaying(false)}
      >
        {typeFile === "video" ? (
          <video
            className={styles.card__imageContainer__img}
            autoPlay={false}
            loop
            muted
            playsInline
            ref={(video) => {
              if (video) {
                isPlaying ? video.play() : video.pause();
              }
            }}
          >
            <source src={project.images.url} />
          </video>
        ) : (
          <figure>
            <img src={project.images.url || ""} alt="" />
          </figure>
        )}

        <div className={styles.overlayContainer}>
          <span>{project.title}</span>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoContainer__inner}>
          <div className={styles.infoContainer__inner__url}>
            <img src={project.creator?.image} alt="" />
            <span className="project-admin">
              @{project.creator?.username || ""}
            </span>
          </div>
          <div className={styles.infoContainer__inner__actions}>
            {(project.creator.id === user?.id ||
              user?.role.name === "Administrador") && (
              <div onClick={() => handleEditingProject(project)}>
                <EditIcon />
              </div>
            )}
            {user?.role.name === "Administrador" && (
              <div className={styles.visibilityControls}>
                {project.hidden ? (
                  <div
                    onClick={() => handleVisibilityChange(false)}
                    title="Hacer visible"
                  >
                    <ShowIcon className="large-icon" />
                  </div>
                ) : (
                  <div
                    onClick={() => handleVisibilityChange(true)}
                    title="Ocultar proyecto"
                  >
                    <HideIcon className="large-icon" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProjectItem;
