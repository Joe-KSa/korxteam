import { useEffect, useCallback, useMemo } from "react";
import { ProjectService } from "@/core/services/project/projectService";
import { projectStore } from "@/store/store";

export const useProjects = (projectId?: number) => {
  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    projectDominantColor,
    setProjectDominantColor,
    showComments,
    setShowComments,
  } = projectStore();

  // Filtramos proyectos visibles
  const visibleProjects = useMemo(
    () => projects.filter((project) => project.hidden !== true),
    [projects]
  );

  const loadProjects = useCallback(async () => {
    const projectsData = await new ProjectService().getProjects();
    setProjects(projectsData);
  }, []);

  const loadProject = useCallback(async (id: number) => {
    try {
      const projectData = await new ProjectService().getProjectById(id);
      setSelectedProject(projectData);
      return projectData;
    } catch (err) {
      console.error("Error al cargar proyecto:", err);
      return null;
    }
  }, [setSelectedProject]);
  

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);


  // Nuevo efecto para manejar la selección basada en projectId
  useEffect(() => {
    if (projectId) {
      loadProject(projectId).then((project) => {
        if (project) {
          setProjectDominantColor(project.images.url);
        } else {
          // Opcional: Manejar proyecto no encontrado
          setSelectedProject(null);
        }
      });
    }
  }, [projectId, loadProject, setProjectDominantColor, setSelectedProject]);
  

  return {
    loadProject,
    projects,
    setProjects,
    visibleProjects,
    loadProjects,
    selectedProject,
    showComments,
    setShowComments,
    setSelectedProject,
    projectDominantColor,
    setProjectDominantColor,
    projectBanner:
      selectedProject || visibleProjects[0],
  };
};
