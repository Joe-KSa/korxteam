import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MemberProfile from "../widget/MemberProfile";
import { useMembers } from "@/hooks/useMembers";
import ResizeBar from "../common/ResizeBar";
import styles from "./SideBar.module.scss";
import { useProjects } from "@/hooks/useProjects";
import Comments from "../widget/Comments";

const SideBar = () => {
  const { selectedMember } = useMembers();
  const { showComments, selectedProject } = useProjects();
  const [contentWidth, setContentWidth] = useState(420);
  const location = useLocation();

  const handleResize = (width: number) => {
    setContentWidth(Math.max(280, Math.min(width, 420)));
  };

  // Ocultar en /settings solo en móviles
  const isSettingsPage = location.pathname === "/profile";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if ((!selectedProject && !selectedMember) || (isSettingsPage && isMobile))
    return null;

  const content =
    showComments && selectedProject ? (
      <Comments width={contentWidth} />
    ) : selectedMember ? (
      <MemberProfile width={contentWidth} />
    ) : null;

  if (!content) return null; // Evita renderizar el SideBar vacío

  return (
    <div className={styles.sidebarRight}>
      <ResizeBar onResize={handleResize} />
      {content}
    </div>
  );
};

export default SideBar;
