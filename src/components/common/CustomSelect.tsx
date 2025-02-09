import { useState, useRef, useEffect } from "react";
import Collapsible from "./Collapsible";
// import "./styles/CustomSelect.Styled.css";

interface Option {
  id: number | null;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  defaultOption?: Option;
  onChangeSelected?: (option: Option) => void;
  valueSelected?: Option;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  defaultOption,
  onChangeSelected,
  valueSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    valueSelected || defaultOption || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChangeSelected) {
      onChangeSelected(option);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
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
    if (onChangeSelected && valueSelected) {
      
      onChangeSelected(valueSelected);
    } else {
      if(onChangeSelected && defaultOption) {
        setSelectedOption(defaultOption);
        onChangeSelected(defaultOption);
      }
    }
  }, [valueSelected, defaultOption]);

  const filteredOptions = options.filter(
    (option) => option.id !== selectedOption?.id
  );

  return (
    <div className="custom-select" ref={selectBoxRef} tabIndex={0}>
      <div className="select-box" onClick={() => setIsOpen(!isOpen)}>
        <div className="selected-option" aria-label="Selected option">
          {selectedOption ? selectedOption.name : "Opciones"}
        </div>
        {isOpen && (
          <Collapsible
            items={filteredOptions}
            onSelect={(option) => handleOptionClick(option)}
          />
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
