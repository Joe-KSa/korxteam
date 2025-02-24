import { useParams } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import ProjectList from '@/components/ui/ProjectList';

const ProjectPage = () => {
  const { username } = useParams();
  const { projects } = useProjects();
  
  const filteredProjects = projects.filter((p) => 
    p.hidden !== true && (username ? p.members[0].username === username : true)
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
