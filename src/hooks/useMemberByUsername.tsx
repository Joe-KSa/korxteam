import { useState, useEffect } from "react";
import { MemberService } from "../core/services/member/memberService";
import { getMemberProps } from "@/core/types";

export const useMemberByUsername = (username?: string) => {
  const [member, setMember] = useState<getMemberProps | undefined>();

  useEffect(() => {
    if (!username) return;

    const fetchMember = async () => {
      const memberData = await new MemberService().getMemberByUsername(
        username
      );
      setMember(memberData);
    };

    fetchMember();
  }, [username]);

  return member;
};
