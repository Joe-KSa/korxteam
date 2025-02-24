import styles from './styles/Collapsible.module.scss'

interface Option {
  id: number | null;
  name: string;
}

interface CollapsibleProps {
  items: Option[];
  onSelect: (item: Option) => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({ items, onSelect }) => {
  return (
    <div className={styles.container} aria-expanded="true">
      <div className={styles.container__inner}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.container__inner__item}
            onClick={() => onSelect(item)}
            aria-label={`Seleccionar ${item.name}`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collapsible;
