import { useEffect, useRef, useMemo, useState } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import styles from "./styles/InputField.module.scss";
import CustomSelect from "./CustomSelect";
import SkillInput from "./SkillInput";
import { tagProps } from "@/core/types";

interface Option {
  id: number | null;
  name: string;
}

interface InputFieldProps {
  label?: string;
  type: "text" | "password" | "email" | "select" | "textarea" | "skills";
  htmlFor?: string;
  options?: Option[];
  value?: string;
  valueSkill?: tagProps[],
  valueSelected?: Option;
  onChange?: (value: string) => void;
  onChangeSelected?: (option: Option) => void;
  onChangeSkill?: (tags: tagProps[]) => void;
  error?: string;
  optional?: boolean;
  disableSeparation?: boolean;
  maxLength?: number;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  htmlFor,
  options = [],
  value = "",
  valueSelected,
  onChange,
  disableSeparation = false,
  onChangeSelected,
  onChangeSkill,
  error,
  optional = false,
  valueSkill,
  maxLength,
  disabled
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const isComplete = useMemo(() => value.trim() !== "", [value]);
  const textAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (value !== "") {
      setIsLoading(false);
    }
  }, [value]);

  useEffect(() => {
    if (textAreaRef.current && textAreaRef.current.textContent !== value) {
      textAreaRef.current.textContent = value;
    }
  }, [value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => {
    const newValue = typeof event === "string" ? event : event.target.value;
    if (maxLength && newValue.length > maxLength) return;
    onChange?.(newValue);
  };

  const handleSelectChange = (option: Option) => {
    onChangeSelected?.(option);
  };

  const handleTextAreaInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (maxLength && e.currentTarget.textContent!.length > maxLength) {
      e.preventDefault();
      return;
    }
    onChange?.(e.currentTarget.textContent || "");
  };

  // Limiter textArea controller
  useEffect(() => {
    const element = textAreaRef.current;
    if (!element) return;
  
    const handleBeforeInput = (e: InputEvent) => {
      if (disabled || (maxLength && element.textContent!.length >= maxLength && e.inputType !== "deleteContentBackward")) {
        e.preventDefault(); // Bloquea la entrada antes de que ocurra
      }
    };
  
    element.addEventListener("beforeinput", handleBeforeInput);
    return () => element.removeEventListener("beforeinput", handleBeforeInput);
  }, [maxLength]);


  const handleTextAreaPaste = (e: React.ClipboardEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    const currentContent = textAreaRef.current?.textContent || '';
    
    // Calcula espacio disponible
    const remainingChars = maxLength ? maxLength - currentContent.length : Infinity;
    
    if (remainingChars <= 0) return;
    
    // Trunca el texto pegado
    const truncatedText = pastedText.slice(0, remainingChars);
    
    // Inserta el texto truncado
    document.execCommand('insertText', false, truncatedText);
  };

  return (
    <div
      className={`${styles.containerInput} ${
        disableSeparation ? "" : styles.withSeparation
      }`}
    >
      {label && htmlFor && (
        <div className={styles.labelSection}>
          <label className={styles.labelSection__label} htmlFor={htmlFor}>
            <span>{label}</span>
          </label>
        </div>
      )}

      {type === "textarea" ? (
        <div
          className={`${styles.formInput} ${styles.textAreaContainer}`}
          onClick={() => textAreaRef.current?.focus()}
        >
          <OverlayScrollbarsComponent
            options={{ scrollbars: { autoHide: "scroll", autoHideDelay: 500 } }}
            style={{ height: "100%" }}
          >
            <div className={styles.textAreaContainer__inner}>
              <div
                ref={textAreaRef}
                className={styles.textAreaContainer__inner__textarea}
                contentEditable
                onInput={handleTextAreaInput}
                onPaste={handleTextAreaPaste}
                role="textbox"
                aria-multiline="true"
                spellCheck="false"
              />
            </div>
          </OverlayScrollbarsComponent>
        </div>
      ) : type === "select" ? (
        <CustomSelect
          options={options}
          onChangeSelected={handleSelectChange}
          valueSelected={valueSelected}
          defaultOption={options[0]}
        />
      ) : type === "skills" ? (
        <SkillInput id={htmlFor} onChangeSkill={onChangeSkill} value={valueSkill} maxLength={maxLength} disabled= {disabled}
        />
      ) : (
        <input
          type={type}
          id={htmlFor}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder={
            !isComplete && !optional && !isLoading ? error || "" : ""
          }
          className={`${styles.formInput} ${
            !isComplete && !optional && !isLoading ? styles.inputError : ""
          }`}
        />
      )}
    </div>
  );
};

export default InputField;
