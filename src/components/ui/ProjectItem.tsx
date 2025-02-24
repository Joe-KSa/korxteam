import React from "react";
import styles from "./styles/ProjectItem.module.scss";
import { getProjectProps } from "@/core/types";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { EditIcon, ShowIcon, HideIcon } from "@/assets/icons";
import { ProjectService } from "@/core/services/project/projectService";
import { useProjects } from "@/hooks/useProjects";

interface ProjectItem {
  project: getProjectProps;
  setSelectedProject: () => void;
}

const ProjectItem: React.FC<ProjectItem> = ({
  project,
  setSelectedProject,
}) => {
  const { user } = useUser();
  const { projects, setProjects } = useProjects()
  const navigate = useNavigate();

  const handleEditingProject = (project: getProjectProps) => {
    setSelectedProject();
    
    navigate(`/project/${project?.id}/edit`);
  };

  const handleVisibilityChange = async (hidden: boolean) => {
    try {
      await new ProjectService().updateProjectVisibility(project.id, hidden);

      setProjects(
        projects.map(p => 
          p.id === project.id ? { ...p, hidden } : p
        )
      );

    } catch (error) {
      console.error("Error changing visibility:", error);
    }
  };

  return (
    <li className={styles.container}>
      <div className={styles.imageContainer} onClick={setSelectedProject}>
        <figure>
          <img src={project.images.url || ""} alt="" />
        </figure>
        <div className="project-item-extras"></div>
        <a href={project.url}>
          <span>{project.title}</span>
        </a>
        <div className={styles.overlayContainer}>
          <div className={styles.overlayContainer__inner}>
            <div className={styles.overlayContainer__inner__title}>
              {project.title}
            </div>
            <ul className={styles.overlayContainer__inner__actions}>
              {/* Continuar */}
              <li></li>
            </ul>
          </div>
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
                    <ShowIcon className="large-icon"/>
                  </div>
                ) : (
                  <div
                    onClick={() => handleVisibilityChange(true)}
                    title="Ocultar proyecto"
                  >
                    <HideIcon className="large-icon"/>
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
