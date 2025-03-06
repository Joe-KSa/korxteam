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
  placeholder?: string;
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
  disabled,
  placeholder = "",
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
    const selection = window.getSelection();
    if (!selection || !textAreaRef.current) return;
  
    // Obtiene la posición actual del cursor
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(textAreaRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const cursorPosition = preCaretRange.toString().length;
  
    // Obtiene el nuevo contenido
    let text = e.currentTarget.innerText || "";
    if (maxLength && text.length > maxLength) {
      e.preventDefault();
      return;
    }
    onChange?.(text);
  
    // Restaurar posición del cursor sin setTimeout
    requestAnimationFrame(() => {
      if (!textAreaRef.current) return;
  
      const newRange = document.createRange();
      const newSelection = window.getSelection();
      const textNode = textAreaRef.current.firstChild;
  
      if (textNode) {
        const pos = Math.min(cursorPosition, textNode.textContent?.length || 0);
        newRange.setStart(textNode, pos);
        newRange.setEnd(textNode, pos);
      } else {
        newRange.setStart(textAreaRef.current, 0);
        newRange.setEnd(textAreaRef.current, 0);
      }
  
      newSelection?.removeAllRanges();
      newSelection?.addRange(newRange);
    });
  };
  
  // Limiter textArea controller
  useEffect(() => {
    const element = textAreaRef.current;
    if (!element) return;
  
    const handleBeforeInput = (e: InputEvent) => {
      if (disabled || (maxLength && element.innerText!.length >= maxLength && e.inputType !== "deleteContentBackward")) {
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
        <SkillInput id={htmlFor} onChangeSkill={onChangeSkill} value={valueSkill} maxLength={maxLength || 10} disabled= {disabled}
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
            !isComplete && !optional && !isLoading ? error || "" : placeholder
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
