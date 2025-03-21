import { useState, useEffect, useRef } from "react";
import SkillTags from "../widget/SkillTags";
import type { tagProps } from "@/core/types";
import Collapsible from "./Collapsible";
import styles from "./styles/InputField.module.scss";

interface SkillInputProps {
  id?: string;
  value?: tagProps[];
  onChangeSkill?: (tags: tagProps[]) => void;
  error?: string;
  maxLength: number;
  disabled?: boolean;
  items: tagProps[];
  setItems: (items: tagProps[]) => void;
  allSuggestions: tagProps[];
}

const SkillInput: React.FC<SkillInputProps> = ({
  value = [],
  id,
  onChangeSkill,
  maxLength,
  disabled = false,
  items,
  setItems,
  allSuggestions,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<tagProps[]>(
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (JSON.stringify(items) !== JSON.stringify(value)) {
      setItems(value);
    }
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      setFilteredSuggestions(
        allSuggestions.filter(
          (suggestion) =>
            suggestion.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !items.some((tag) => tag.name === suggestion.name)
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, allSuggestions, items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
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
    if (disabled || items.length >= maxLength) return;
    const existingTag = allSuggestions.find(
      (suggestion) => suggestion.name === tag
    );
    if (!existingTag) return;
    if (!items.some((t) => t.name === tag)) {
      const newItems = [...items, existingTag];
      setItems(newItems);
      onChangeSkill?.(newItems);
    }
    setInputValue("");
  };

  const handleRemoveTag = (tag: string) => {
    if (disabled) return;
    const newItems = items.filter((t) => t.name !== tag);
    setItems(newItems);
    onChangeSkill?.(newItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Enter" && inputValue) {
      handleAddTag(inputValue);
    }
  };

  const handleInputFocus = () => {
    setFilteredSuggestions(
      allSuggestions.filter(
        (suggestion) => !items.some((tag) => tag.name === suggestion.name)
      )
    );
    containerRef.current?.classList.add("input-focus");
  };

  const handleInputBlur = () => {
    containerRef.current?.classList.remove("input-focus");
  };

  return (
    <div
      className={styles.formInput}
      style={{ display: "flex", alignItems: "center" }}
      ref={containerRef}
    >
      <div className={styles.skillInputContainer}>
        <SkillTags tags={items.map((t) => t.name)} onRemoveTag={handleRemoveTag}>
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
            disabled={items.length >= maxLength || disabled}
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
