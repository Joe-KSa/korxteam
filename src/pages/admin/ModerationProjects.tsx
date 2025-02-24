import { useProjects } from '@/hooks/useProjects';
import ProjectList from '@/components/ui/ProjectList';

const ModerationProjectsPage = () => {
  const { projects } = useProjects();
  
  return (
    <ProjectList
      title="Proyectos Ocultos"
      projects={projects.filter(p => p.hidden === true)} // Proyectos ocultos
      emptyMessage="No hay proyectos ocultos"
    />
  );
};

export default ModerationProjectsPage;