import { useCallback, useState } from "react";
import { ProjectService } from "@/core/services/project/projectService";
import { projectMembersStore } from "@/store/store";

const projectService = new ProjectService();

export const useProjectMembers = () => {
  const { projectMembers, setProjectMembers } = projectMembersStore();
  const [isLoading, setIsLoading] = useState(false);

  const loadProjectMembers = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        const projectMembersData = await projectService.getProjectMembers(id);
        setProjectMembers(projectMembersData);
      } catch (error) {
        console.error("Error loading project members:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setProjectMembers]
  );

  return { projectMembers, setProjectMembers, loadProjectMembers, isLoading };
};
