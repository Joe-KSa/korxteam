import { useState } from "react";
import styles from "./styles/InputColor.module.scss";

interface InputColorProps {
  text: string;
  defaultColor: string;
  onChange: (color: string) => void;
}

const InputColor = ({ text, onChange, defaultColor }: InputColorProps) => {
  const [color, setColor] = useState<string>(defaultColor);

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
          value={color}
          onChange={handleColorChange}
        />
        <span>{text}</span>
      </div>
    </div>
  );
};

export default InputColor;
