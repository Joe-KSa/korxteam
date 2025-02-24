import { useState, useEffect, useRef } from "react";
import SkillTags from "../widget/SkillTags";
import type { tagProps } from "@/core/types";
import { useTags } from "@/hooks/useTags";
import Collapsible from "./Collapsible";
import styles from "./styles/InputField.module.scss";

interface SkillInputProps {
  id?: string;
  value?: tagProps[];
  onChangeSkill?: (tags: tagProps[]) => void;
  error?: string;
  maxLength: number;
  disabled?: boolean;
}

const SkillInput: React.FC<SkillInputProps> = ({
  value = [],
  id,
  onChangeSkill,
  maxLength, // Límite por defecto
  disabled = false,
}) => {
  const { tags, setTags, suggestionsTags, setSuggestionsTags } = useTags();
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<tagProps[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTags(value);
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      setFilteredSuggestions(
        suggestionsTags.filter((suggestion) =>
          suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, suggestionsTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setFilteredSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = (tag: string) => {
    if (disabled || tags.length >= maxLength) return; // Respetar el límite de etiquetas

    const existingTag = suggestionsTags.find((suggestion) => suggestion.name === tag);
    if (!existingTag) return; // Solo agregar etiquetas que existen en las sugerencias

    if (!tags.some((t) => t.name === tag)) {
      const newTags = [...tags, existingTag];
      setTags(newTags);
      onChangeSkill?.(newTags);
      setSuggestionsTags(suggestionsTags.filter((suggestion) => suggestion.name !== tag));
    }

    setInputValue("");
  };

  const handleRemoveTag = (tag: string) => {
    if (disabled) return; // Bloquear si está deshabilitado
    const newTags = tags.filter((t) => t.name !== tag);
    setTags(newTags);
    onChangeSkill?.(newTags);

    const removedTag = tags.find((t) => t.name === tag);
    if (removedTag && !suggestionsTags.some((s) => s.name === removedTag.name)) {
      setSuggestionsTags([...suggestionsTags, removedTag]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return; // Bloquear si está deshabilitado
    if (e.key === "Enter" && inputValue) {
      handleAddTag(inputValue);
    }
  };

  const handleInputFocus = () => {
    setFilteredSuggestions(
      suggestionsTags.filter((suggestion) => !tags.some((tag) => tag.name === suggestion.name))
    );
    containerRef.current?.classList.add("input-focus");
  };

  const handleInputBlur = () => {
    containerRef.current?.classList.remove("input-focus");
  };

  return (
    <div className={styles.formInput} style={{ display: "flex", alignItems: "center" }} ref={containerRef}>
      <div className={styles.skillInputContainer}>
        <SkillTags tags={tags.map((t) => t.name)} onRemoveTag={handleRemoveTag}>
          <input
            type="text"
            name="skill"
            id={id}
            maxLength={20}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className={styles.skillInputContainer__skillInput}
            ref={inputRef}
            disabled={tags.length >= maxLength || disabled} 
          />
        </SkillTags>
      </div>
      {filteredSuggestions.length > 0 && (
        <Collapsible
          items={filteredSuggestions.map((suggestion) => ({
            id: suggestion.id,
            name: suggestion.name,
          }))}
          onSelect={(selectedItem) => handleAddTag(selectedItem.name)}
        />
      )}
    </div>
  );
};

export default SkillInput;
