import { useCallback } from "react";
import { ProjectMemberService } from "@/core/services/projectMember/projectMemberService";
import { projectMembersStore } from "@/store/store";

export const useProjectMembers = () => {
  const { projectMembers, setProjectMembers } = projectMembersStore();
  const roleOrder = [2, 3, 1];

  const loadProjectMembers = useCallback(async (id: number) => {
    const projectMembersData =
      await new ProjectMemberService().getProjectMembers(id);

    const sortedProjectMembers = projectMembersData.sort((a, b) => {
      const roleA = a.role.id ?? 0;
      const roleB = b.role.id ?? 0;

      const roleComparison =
        roleOrder.indexOf(roleA) - roleOrder.indexOf(roleB);
      if (roleComparison !== 0) {
        return roleComparison;
      }
      return a.id - b.id;
    });

    setProjectMembers(sortedProjectMembers);
  }, []);

  return { projectMembers, setProjectMembers, loadProjectMembers };
};
