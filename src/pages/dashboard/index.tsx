import { useRef } from "react";
import useVisibilityObserver from "@/hooks/useVisibilityObserver";
import WorkSpace from "@/components/ui/Workspace";
import ProjectCard from "@/components/ui/ProjectCard";
import TableMembers from "@/components/widget/TableMembers";
import OverviewSection from "@/components/ui/OverviewSection";
import DetailsSection from "@/components/ui/DetailsSection";

const Dashboard = () => {
  const projectCardRef = useRef<HTMLDivElement>(null);
  const isOverviewSectionVisible = useVisibilityObserver(
    projectCardRef as React.RefObject<HTMLElement>
  );

  return (
    <WorkSpace>
      <OverviewSection overViewSectionRef={projectCardRef}>
        <ProjectCard />
      </OverviewSection>
      <DetailsSection>
        <TableMembers isOverviewSectionVisible={isOverviewSectionVisible} />
      </DetailsSection>
    </WorkSpace>
  );
};

export default Dashboard;
