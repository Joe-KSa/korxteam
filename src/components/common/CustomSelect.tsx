import { useState, useRef, useEffect } from "react";
import Collapsible from "./Collapsible";
import stylesInput from "./styles/InputField.module.scss";

interface Option {
  id: number | null;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  onChangeSelected?: (option: Option) => void;
  valueSelected?: Option;
  itemsSelected?: string[];
  showAllOptions?: boolean;
  placeholder?: string; // Ahora es opcional
  onRemoveSelectedIcon?: (item: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChangeSelected,
  valueSelected,
  itemsSelected,
  showAllOptions = false,
  placeholder, // No se establece un valor por defecto
  onRemoveSelectedIcon
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    valueSelected ?? (options.length > 0 ? options[0] : null)
  );
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const initialDefaultFired = useRef(false);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChangeSelected?.(option);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectBoxRef.current &&
      !selectBoxRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (valueSelected !== undefined) {
      if (valueSelected?.id !== selectedOption?.id) {
        setSelectedOption(valueSelected);
      }
    } else {
      if (options.length > 0) {
        const isCurrentOptionValid = selectedOption && options.some(opt => opt.id === selectedOption.id);

        if (!isCurrentOptionValid) {
          const firstOption = options[0];
          setSelectedOption(firstOption);
          onChangeSelected?.(firstOption);
          initialDefaultFired.current = true;
        } else if (!initialDefaultFired.current) {
          onChangeSelected?.(selectedOption);
          initialDefaultFired.current = true;
        }
      } else {
        setSelectedOption(null);
        initialDefaultFired.current = false;
      }
    }
  }, [valueSelected, options, selectedOption?.id, onChangeSelected]);

  const filteredOptions = showAllOptions ? options : options.filter(
    (option) => option.id !== selectedOption?.id
  );

  return (
    <div ref={selectBoxRef} tabIndex={0}>
      <div
        className={stylesInput.formInput}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ paddingTop: "5px" }} aria-label="Selected option">
          {isOpen && placeholder !== undefined ? placeholder : selectedOption ? selectedOption.name : "Opciones"}
        </div>
        {isOpen && (
          <Collapsible
            items={filteredOptions}
            onSelect={handleOptionClick}
            itemsSelected={itemsSelected}
            onRemoveSelectedIcon={onRemoveSelectedIcon}
          />
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
