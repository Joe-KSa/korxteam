import styles from "./styles/DetailsSection.module.scss";

const DetailsSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__inner}>{children}</div>
    </div>
  );
};

export default DetailsSection;
