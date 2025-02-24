import React from "react";
import styles from "./styles/OverviewSection.module.scss";

const OverviewSection: React.FC<{
  children: React.ReactNode;
  overViewSectionRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, overViewSectionRef }) => {
  return (
    <div className={styles.container} ref={overViewSectionRef}>
      {children}
    </div>
  );
};

export default OverviewSection;
