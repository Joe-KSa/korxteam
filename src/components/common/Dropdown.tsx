import styles from "./styles/Dropdown.module.scss";

interface DropdownProps {
    children: React.ReactNode;
    transform: string;
}

const Dropdown : React.FC<DropdownProps> = ({children, transform}) => {

  return (
    <div className={styles.container} style={{transform}}>
      <div id="context-menu">
        <div className={styles.container__inner}>
          <ul role="menu">
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
