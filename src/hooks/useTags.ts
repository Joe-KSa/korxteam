import { useEffect } from "react";
import { TagService } from "../core/services/tag/tagService";
import { tagsStore } from "@/store/store";

export const useTags = () => {

  const { tags, setTags, suggestionsTags, setSuggestionsTags} = tagsStore(); 
  
  useEffect(() => {
    const loadTags = async () => {
      const tags = await new TagService().getTags();

      const newSuggestions = tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));
      setSuggestionsTags(newSuggestions);
    };

    loadTags();
  }, []);

  return { tags, setTags, suggestionsTags, setSuggestionsTags };
};
