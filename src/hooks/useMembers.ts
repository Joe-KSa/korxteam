import { useCallback } from "react";
import { MemberService } from "@/core/services/member/memberService";
import { membersStore } from "@/store/store";
import { useUser } from "./useUser";

export const useMembers = () => {
  const { members, setMembers, selectedMember, setSelectedMember } =
    membersStore();
  const { user } = useUser();
  const roleOrder = [2, 3, 1];

  const loadMembers = useCallback(async () => {
    const membersData = await new MemberService().getMembers();

    const sortedMembers = membersData.sort((a, b) => {

      if(a.userId === user?.id) return -1;
      if (b.userId === user?.id) return 1;

      const roleA = a.role.id ?? 0;
      const roleB = b.role.id ?? 0;

      const roleComparison =
        roleOrder.indexOf(roleA) - roleOrder.indexOf(roleB);
      if (roleComparison !== 0) {
        return roleComparison;
      }
      return a.id - b.id;
    });

    setMembers(sortedMembers);
  }, [setMembers, user]);

  return {
    members,
    setMembers,
    loadMembers,
    selectedMember,
    setSelectedMember,
  };
};
