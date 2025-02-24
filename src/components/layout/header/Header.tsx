import styles from "./styles/Navbar.module.scss"
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className={styles.container} id="global-nav-bar" data-test-id="global-nav-bar">
      <Navbar />
    </header>
  );
};

export default Header;
