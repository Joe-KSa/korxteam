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
    const projectData = await new ProjectService().getProjects();
    setProjects(projectData);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const deselectProject = useCallback(() => {
    setSelectedProject(null);
  }, [setSelectedProject]);

  // Nuevo efecto para manejar la selección basada en projectId
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setProjectDominantColor(project.images.url);
      } else {
        // Opcional: Manejar proyecto no encontrado
        setSelectedProject(null);
      }
    }
  }, [projectId, projects, setSelectedProject]);

  return {
    projects,
    setProjects,
    visibleProjects,
    loadProjects,
    selectedProject,
    showComments,
    setShowComments,
    setSelectedProject,
    deselectProject,
    projectDominantColor,
    setProjectDominantColor,
    projectBanner:
      selectedProject || visibleProjects[0],
  };
};
