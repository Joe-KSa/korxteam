import { useState, useEffect } from "react";
import styles from "./styles/Search.module.scss";
import Button, { ButtonHoverStyle, ButtonStyle } from "../common/Button";
import {
  HomeIcon,
  SearchIcon,
  ProjectIcon,
  BackIcon,
} from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";

interface SearchProps {
  setSearchExpanded: (value: boolean) => void;
  searchExpanded: boolean;
}

export const Search: React.FC<SearchProps> = ({
  setSearchExpanded,
  searchExpanded,
}) => {
  const navigate = useNavigate();
  const { setSelectedProject, setShowComments } = useProjects();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleButtonClick = () => {
    if (searchExpanded) {
      setSearchExpanded(false);
    } else {
      setSelectedProject(null);
      setShowComments(false);
      navigate("/");
    }
  };

  return (
    <div className={styles.searchContainer}>
      {windowWidth < 900 && !searchExpanded && (
        <div className={styles.searchContainer__wrapper}>
          <Button
            styleType={ButtonStyle.ICON}
            onClick={() => setSearchExpanded(true)}
            padding="8px"
            margin="0"
            borderRadius="50%"
            hoverStyleType={ButtonHoverStyle.NORMAL}
          >
            <SearchIcon className="medium-icon" />
          </Button>
        </div>
      )}

      {(searchExpanded || windowWidth >= 900) && (
        <div
          className={styles.searchContainer__inner}
          style={{ maxWidth: searchExpanded ? "100%" : "546px" }}
        >
          <div className={styles.searchContent}>
            <Button
              styleType={ButtonStyle.ICON}
              backgroundColor={
                searchExpanded
                  ? "transparent"
                  : "var(--background-elevated-base)"
              }
              borderRadius="50%"
              hoverStyleType={ButtonHoverStyle.NORMAL}
              onClick={() => handleButtonClick()}
            >
              {searchExpanded ? (
                <BackIcon className="large-icon" />
              ) : (
                <HomeIcon className="large-icon" />
              )}
            </Button>

            <div className={styles.searchFormWrapper}>
              <form action="" role="search">
                <div className={styles.desktopSearchIcon}>
                  <SearchIcon className="large-icon" />
                </div>

                <div className={styles.searchInputContainer}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="¿Qué quieres buscar?"
                  />
                  <div className={styles.inputPlaceholderHelper}>
                    <span>¿Qué quieres buscar?</span>
                  </div>
                </div>
                {!searchExpanded && (
                  <div className={styles.projectsButtonContainer}>
                    <div className={styles.projectsButtonContainer__inner}>
                      <Button
                        styleType={ButtonStyle.ICON}
                        padding="0"
                        href="/projects"
                        redirect
                        onClick={() => setShowComments(false)}
                      >
                        <ProjectIcon className="large-icon" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
