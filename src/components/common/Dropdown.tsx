import styles from "./styles/Dropdown.module.scss";

interface DropdownProps {
    children: React.ReactNode;
    transform: string;
    minWidth?: string;
}

const Dropdown : React.FC<DropdownProps> = ({children, transform, minWidth = "160px"}) => {

  return (
    <div className={styles.container} style={{transform}}>
      <div id="context-menu">
        <div className={styles.container__inner}>
          <ul role="menu" style={{minWidth}}>
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
