import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MemberProfile from "../widget/MemberProfile";
import { useMembers } from "@/hooks/useMembers";
import ResizeBar from "../common/ResizeBar";
import styles from "./SideBar.module.scss";

const SideBar = () => {
  const { selectedMember } = useMembers();
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

  if (!selectedMember || (isSettingsPage && isMobile)) return null;

  return (
    <div className={styles.sidebarRight}>
      <ResizeBar onResize={handleResize} />
      <MemberProfile width={contentWidth} />
    </div>
  );
};

export default SideBar;
