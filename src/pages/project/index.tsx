import { useParams } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import ProjectList from '@/components/ui/ProjectList';
import { useMemo } from 'react';

const ProjectPage = () => {
  const { username } = useParams();
  const { projects } = useProjects();
  
  const filteredProjects = useMemo(() => 
    projects.filter((p) => 
      p.hidden !== true && (username ? p.creator.username === username : true)
    ), 
    [projects, username]
  );

  return (
    <ProjectList
      title={"Librería"}
      projects={filteredProjects}
      emptyMessage="Buscando proyectos"
    />
  );
};
export default ProjectPage;