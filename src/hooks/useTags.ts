import { useEffect } from "react";
import { TagService } from "../core/services/tag/tagService";
import { tagsStore } from "@/store/store";

export const useTags = () => {
  const { tags, setTags } = tagsStore();

  useEffect(() => {
    const loadTags = async () => {
      const tagsData = await new TagService().getTags();
      setTags(tagsData);
    };

    loadTags();
  }, []);

  return { tags, setTags };
};
