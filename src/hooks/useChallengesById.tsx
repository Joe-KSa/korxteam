import { useState, useEffect } from "react";
import { ChallengeService } from "@/core/services/challenge/challengeService";
import { getUserChallengesProps } from "@/core/types";

export const useChallengesById = (userId: string) => {
  const [devChallenges, setDevChallenges] = useState<getUserChallengesProps[]>([]);

  useEffect(() => {
    if (!userId && typeof userId !== 'string' ) return;

    const fetchMember = async () => {
      const challengesData = await new ChallengeService().
        getChallengesByUserId(userId);
      setDevChallenges(challengesData);
    };

    fetchMember();
  }, [userId]);
  
  return { devChallenges };
};
