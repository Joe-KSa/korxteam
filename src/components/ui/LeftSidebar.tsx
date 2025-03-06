import styles from "./styles/LeftSidebar.module.scss";
import Button, { ButtonStyle } from "../common/Button";
import { DashboardIcon, RoundedIcon } from "@/assets/icons";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { useMembers } from "@/hooks/useMembers";
import { useProjects } from "@/hooks/useProjects";

const LeftSidebar = () => {
  const { setSelectedMember, members } = useMembers();
  const { setShowComments } = useProjects();

  return (
    <div className={styles.container}>
      <nav className={styles.container__inner}>
        <div className={styles.container__inner__content}>
          <div className={styles.navigation}>
            <header className={styles.navigation__wrapper}>
              <div className={styles.navigation__wrapper__content}>
                <div className={styles.navButtons}>
                  <Button
                    styleType={ButtonStyle.ICON}
                    padding="0"
                    justifyContent="center"
                    width="40px"
                    height="40px"
                  >
                    <DashboardIcon className="large-icon" />
                  </Button>
                  <Button
                    styleType={ButtonStyle.ICON}
                    padding="0"
                    justifyContent="center"
                    width="32px"
                    height="32px"
                  >
                    <RoundedIcon />
                  </Button>
                </div>
              </div>
            </header>
            {/* Lista de miembros */}
            <div className={styles.navigation__members}>
              <OverlayScrollbarsComponent
                style={{ height: "100%" }}
                options={{
                  scrollbars: {
                    autoHide: "scroll",
                    autoHideDelay: 500,
                  },
                }}
              >
                <ul className={styles.navigation__members__list}>
                  {[...members]
                    .sort((a, b) => b.projectsCount - a.projectsCount)
                    .map((member, index) => (
                      <li
                        className={styles.listItem}
                        onClick={() => {
                          setSelectedMember(member);
                          setShowComments(false);
                        }}
                        key={index}
                      >
                        <div className={styles.listItem__inner}>
                          <div className={styles.listItem__inner__content}>
                            <div className={styles.imageContainer}>
                              <div className={styles.imageContainer__inner}>
                                <img
                                  src={member.images.avatar.url}
                                  alt={member.name}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </OverlayScrollbarsComponent>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LeftSidebar;
