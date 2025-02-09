import { useRef } from "react";
import useVisibilityObserver from "@/hooks/useVisibilityObserver";
import styles from "./styles/Home.module.scss"

import ProjectCard from "@/components/ui/ProjectCard";
import TableMembers from "@/components/widget/TableMembers";

const Dashboard = () => {
  const projectCardRef = useRef<HTMLDivElement>(null);
  const isProjectCardVisible = useVisibilityObserver(
    projectCardRef as React.RefObject<HTMLElement>
  );

  return (
    <main className={styles.container}>
      <section className={styles.container__inner} role="presentation">
        <ProjectCard projectCardRef={projectCardRef} />
        <TableMembers isProjectCardVisible={isProjectCardVisible} />
      </section>
    </main>
  );
};

export default Dashboard;
