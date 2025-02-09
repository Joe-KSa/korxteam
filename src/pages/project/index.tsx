import image from "@/assets/Searching.gif";
import { useProjects } from "@/hooks/useProjects";
import ProjectItem from "@/components/ui/ProjectItem";
import styles from "./styles/Project.module.scss"
import { useNavigate } from "react-router-dom";
import { getProjectProps } from "@/core/types";

const ProjectPage = () => {
  const { projects, setSelectedProject } = useProjects();
  const navigate = useNavigate()

  const handleSelectProject = (project: getProjectProps) => {
    setSelectedProject(project)
    navigate("/")
  }

  return (
    <>
      {projects.length > 0 ? (
        <div className={styles.container}>
          <h1 className={styles.container__title}>Libreria</h1>
          {/* <h2 className={styles.container__subtitle}>Proyectos del equipo</h2> */}
          <div className={styles.container__content}>
            <ol>
              {projects.map((project) => (
                <ProjectItem
                  key={project.id}
                  image={project.image}
                  title={project.title}
                  url={project.url}
                  creator={project.creator}
                  setSelectedProject={() => handleSelectProject(project)}
                />
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className="no-items-message">
          <div className="no-items-container">
            <img src={image} alt="MemberGif" />
            <span>Buscando Proyects</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectPage;
