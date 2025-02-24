import { MemberService } from "@/core/services/member/memberService";
import { membersStore } from "@/store/store";
import { useEffect, useState, useCallback, useRef } from "react";

export const useMembers = () => {
  const {
    members,
    setMembers,
    selectedMember,
    setSelectedMember,
    hiddenMembers,
    setHiddenMembers,
  } = membersStore();
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false); // bandera para controlar la carga

  // En useMembers.ts
  const loadMembers = useCallback(
    async (
      sortBy = "rolePriority",
      sort: "asc" | "desc" = "asc",
      force = false
    ) => {
      if (!force && (hasLoadedRef.current || members.length > 0)) return;

      try {
        setIsLoading(true);
        const membersData = await new MemberService().getMembers(sort, sortBy);

        const visibleMembers = membersData.filter((member) => !member.hidden);
        const hiddenMembersData = membersData.filter((member) => member.hidden);

        setMembers(visibleMembers);
        setHiddenMembers(hiddenMembersData);
        hasLoadedRef.current = true;
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [members.length, setMembers, setHiddenMembers]
  );

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    loadMembers,
    members,
    hiddenMembers,
    setMembers,
    isLoading,
    selectedMember,
    setSelectedMember,
  };
};
