import React from 'react';
import { getProjectProps } from '@/core/types';
import ProjectItem from '@/components/ui/ProjectItem';
import image from '@/assets/Searching.gif';
import styles from "@/pages/project/styles/Project.module.scss"
import { useProjects } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';

interface ProjectListProps {
  title: string;
  projects: getProjectProps[];
  emptyMessage: string;
}

const ProjectList: React.FC<ProjectListProps> = ({
  title,
  projects,
  emptyMessage,
}) => {
  const { setSelectedProject } = useProjects();
  const navigate = useNavigate();

  const handleSelectProject = (project: getProjectProps) => {
    
    setSelectedProject(project);
    navigate(`/project/${project.id}`)
  };

  return (
    <>
      {projects.length > 0 ? (
        <div className={styles.container}>
          <h1 className={styles.container__title}>{title}</h1>
          <div className={styles.container__content}>
            <ol>
              {projects.map((project) => (
                <ProjectItem
                  project={project}
                  key={project.id}
                  setSelectedProject={() => handleSelectProject(project)}
                />
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className="no-items-message">
          <div className="no-items-container">
            <img src={image} alt="SearchingGif" />
            <span>{emptyMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;