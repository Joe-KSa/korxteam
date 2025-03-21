import styles from "./styles/Collapsible.module.scss";
import { RemoveIcon } from "@/assets/icons";

interface Option {
  id: number | null;
  name: string;
}

interface CollapsibleProps {
  items: Option[];
  onSelect: (item: Option) => void;
  itemsSelected?: string[];
  onRemoveSelectedIcon?: (item: string) => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  items,
  onSelect,
  itemsSelected = [],
  onRemoveSelectedIcon,
}) => {
  return (
    <div className={styles.container} aria-expanded="true">
      <div className={styles.container__inner}>
        {items.map((item) => {
          const isSelected = itemsSelected.includes(item.name);

          return (
            <div
              key={item.id}
              className={styles.container__inner__item}
              onClick={() => onSelect(item)}
              aria-label={`Seleccionar ${item.name}`}
            >
              {item.name}{" "}
              {isSelected && onRemoveSelectedIcon && (
                <span onClick={() => onRemoveSelectedIcon(item.name)}>
                  <RemoveIcon />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collapsible;
