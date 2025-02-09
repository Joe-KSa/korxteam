import { useEffect, useState } from "react";
import { ModeratorService } from "../core/services/moderators/moderatorService";

export const useModerator = () => {
  const [moderators, setModerators] = useState([]);

  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const moderatorsData = await new ModeratorService().getModerators();

        if (moderatorsData) {
          setModerators(moderatorsData);
        } else {
          console.error("Failed to fetch moderators");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchModerators();
  }, []);

  return { moderators };
};
