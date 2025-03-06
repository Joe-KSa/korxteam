import { Outlet } from "react-router-dom";
import Header from "./components/layout/header/Header";
import Sidebar from "./components/layout/SideBar";
import { useProjects } from "./hooks/useProjects";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";
import "./styles/globals.css";
import "./styles/variables.css";
import styles from "./styles/Layout.module.scss"
import image from "@/assets/Loading.gif";

import LeftSidebar from "./components/ui/LeftSidebar";

const Layout: React.FC = () => {
  const { projects } = useProjects();
  return (
    <div className={styles.appContainer}>
      <div className={styles.appContainer__app}>
        <div className={styles.appContainer__app__content}>
          <Header />
          <LeftSidebar />
          <div
            className={`${styles.pageContainer} `}
          >
            <div className={styles.pageContainer__inner}>
              <div className={styles.pageContainer__inner__content}>
                {projects.length > 0 ? (
                  <OverlayScrollbarsComponent
                    options={{
                      scrollbars: {
                        autoHide: "scroll",
                        autoHideDelay: 500,
                      },
                    }}
                    style={{ height: "100%" }}
                  >
                    <Outlet />
                  </OverlayScrollbarsComponent>
                ) : (
                  <div className="no-items-message">
                    <div className="no-items-container">
                      <img src={image} alt="Error loading projects" />
                      <span>Un momento, por favor</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
