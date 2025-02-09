import { useEffect, useCallback } from "react";
import { ProjectService } from "@/core/services/project/projectService";
import { projectStore } from "@/store/store";

export const useProjects = () => {
  const { projects, setProjects, selectedProject, setSelectedProject } =
    projectStore();

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

  return {
    projects,
    setProjects,
    loadProjects,
    selectedProject,
    setSelectedProject,
    deselectProject,
    projectBanner: selectedProject || projects[0],
  };
};
