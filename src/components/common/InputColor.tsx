import { useState, useEffect } from "react";
import styles from "./styles/InputColor.module.scss";

interface InputColorProps {
  text: string;
  defaultColor: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const InputColor = ({ text, onChange, defaultColor, disabled }: InputColorProps) => {
  const [color, setColor] = useState<string>(defaultColor);

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.currentTarget.value;
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__inner}>
        <input
          name="color"
          type="color"
          disabled={disabled}
          value={color}
          onChange={handleColorChange}
        />
        <span>{text}</span>
      </div>
    </div>
  );
};

export default InputColor;
