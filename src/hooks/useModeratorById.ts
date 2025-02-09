import { useState, useEffect } from "react";
import { ModeratorService } from "@/core/services/moderators/moderatorService";
import { moderatorProps } from "@/core/types";

export const useModeratorById = (id?: string) => {
  const [moderator, setModerator] = useState<moderatorProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchModerator = async () => {
      setIsLoading(true);
      try {
        const moderatorData = await new ModeratorService().getModeratorById(id);
        setModerator(moderatorData || null);
      } catch (error) {
        console.error("Error fetching moderator:", error);
        setModerator(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModerator();
  }, [id]);

  return { moderator, isLoading };
};
