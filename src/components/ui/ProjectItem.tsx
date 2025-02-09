import React from "react";
import styles from "./styles/ProjectItem.module.scss";
import { getMemberProps } from "@/core/types";

interface ProjectItem {
  title: string;
  image: string;
  url: string;
  creator: getMemberProps;
  setSelectedProject: () => void;
}

const ProjectItem: React.FC<ProjectItem> = ({
  title,
  image,
  url,
  creator,
  setSelectedProject,
}) => {
  return (
    <li className={styles.container} onClick={setSelectedProject}>
      <div className={styles.imageContainer}>
        <figure>
          <img src={image} alt="" />
        </figure>
        <div className="project-item-extras"></div>
        <a href={url}>
          <span>{title}</span>
        </a>
        <div className={styles.overlayContainer}>
          <div className={styles.overlayContainer__inner}>
            <div className={styles.overlayContainer__inner__title}>{title}</div>
            <ul className={styles.overlayContainer__inner__actions}>
              {/* Continuar */}
              <li></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoContainer__inner}>
          <div className={styles.infoContainer__inner__url}>
            <img src={creator?.image || ""} alt="" />
            <span className="project-admin">@{creator?.username || ""}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProjectItem;
