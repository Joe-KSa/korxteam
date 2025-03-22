import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/ProjectItem.module.scss";
import { getProjectProps } from "@/core/types";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import {
  EditIcon,
  ShowIcon,
  HideIcon,
  HeartIcon,
  HeartFillIcon,
} from "@/assets/icons";
import { ProjectService } from "@/core/services/project/projectService";
import { getFileType } from "@/utils/validateMedia";
import { debounce } from "lodash";
import DiscordLogo from "@/assets/DiscordLogo.jpg"

interface ProjectItem {
  project: getProjectProps;
  setSelectedProject: () => void;
  updateProject: (updatedProject: getProjectProps) => void;
}

const ProjectItem: React.FC<ProjectItem> = ({
  project,
  setSelectedProject,
  updateProject,
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [like, setLike] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const typeFile = getFileType(project?.images?.url ?? "image");
  const isGif = project.images.url?.endsWith(".gif");

  // Generamos la URL estática cambiando la extensión a .png
  const staticGifUrl = isGif
    ? project.images.url.replace(".gif", ".png")
    : project.images.url;

  // Cargar estado de like del proyecto
  useEffect(() => {
    if (project.likes && user) {
      const userLiked = project.likes.some((l) => l.id === user.id);
      setLike(userLiked);
    }
  }, [project.likes, user?.id]);

  useEffect(() => {
    if (isGif && imgRef.current) {
      if (isHovered) {
        // Al pasar el mouse, se carga el gif (opcionalmente forzamos la recarga con timestamp)
        imgRef.current.src = `${project.images.url}?t=${Date.now()}`;
      } else {
        // Se muestra la versión estática
        imgRef.current.src = staticGifUrl;
      }
    }
  }, [isHovered, project.images.url, isGif, staticGifUrl]);

  const handleEditingProject = (project: getProjectProps) => {
    setSelectedProject();
    navigate(`/project/${project?.id}/edit`);
  };

  const handleVisibilityChange = async (hidden: boolean) => {
    try {
      await new ProjectService().updateProjectVisibility(project.id, hidden);
      updateProject({ ...project, hidden });
    } catch (error) {
      console.error("Error changing visibility:", error);
    }
  };

  const debouncedToggleLikeRef = useRef(
    debounce(
      async (
        projectId: number,
        userId: string,
        previousLike: boolean,
        previousLikesCount: number,
        previousLikes: any[]
      ) => {
        const projectService = new ProjectService();
        try {
          const { success } = await projectService.toggleLike(
            projectId,
            userId
          );
          if (!success) {
            throw new Error("La operación no fue exitosa");
          }
        } catch (error) {
          // Revierte el estado si hay error
          setLike(previousLike);
          updateProject({
            ...project,
            likesCount: previousLikesCount,
            likes: previousLikes,
          });
          console.error("Error al actualizar like:", error);
        }
      },
      300 // Tiempo de espera de 300ms
    )
  );

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    // Captura el estado anterior
    const previousLike = like;
    const previousLikesCount = project.likesCount;
    const previousLikes = [...project.likes];

    // Actualización optimista
    const newLike = !previousLike;
    setLike(newLike);
    updateProject({
      ...project,
      likesCount: newLike ? project.likesCount + 1 : project.likesCount - 1,
      likes: newLike
        ? [...project.likes, { id: user.id }]
        : project.likes.filter((l) => l.id !== user.id),
    });

    // Llama a la función debounce
    debouncedToggleLikeRef.current(
      project.id,
      user.id,
      previousLike,
      previousLikesCount,
      previousLikes
    );
  };

  useEffect(() => {
    return () => {
      debouncedToggleLikeRef.current.cancel();
    };
  }, []);

  return (
    <li className={styles.container}>
      <div
        className={styles.imageContainer}
        onClick={setSelectedProject}
        onMouseEnter={() => {
          setIsPlaying(true);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsPlaying(false);
          setIsHovered(false);
        }}
      >
        {typeFile === "video" ? (
          <video
            className={styles.card__imageContainer__img}
            autoPlay={false}
            loop
            muted
            playsInline
            draggable={false}
            ref={(video) => {
              if (video) {
                isPlaying ? video.play() : video.pause();
              }
            }}
          >
            <source src={project.images.url} />
          </video>
        ) : isGif ? (
          <figure>
            {/* La imagen se inicia con la versión estática */}
            <img ref={imgRef} src={staticGifUrl} alt="" draggable={false} />
          </figure>
        ) : (
          <figure>
            <img src={project.images.url || ""} alt="" draggable={false} />
          </figure>
        )}

        <div className={styles.overlayContainer}>
          <div className={styles.overlayContainer__inner}>
            <span className={styles.overlayContainer__inner__title}>
              {project.title}
            </span>

            <div
              className={styles.overlayContainer__inner__actions}
              onClick={user ? handleToggleLike : undefined}
              style={{
                cursor: user ? "pointer" : "default",
              }}
            >
              <div className={styles.overlayContainer__inner__actions__like}>
                <span>{project.likesCount}</span>
                <i>{like ? <HeartFillIcon /> : <HeartIcon />}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoContainer__inner}>
          <div className={styles.infoContainer__inner__url}>
            <img src={project.creator?.image} alt="" onError={(e) => {
                            e.currentTarget.src = DiscordLogo
                            e.currentTarget.onerror = null;
                        }}/>
            <span className="project-admin">
              @{project.creator?.username || ""}
            </span>
          </div>
          <div className={styles.infoContainer__inner__actions}>
            {(project.creator.id === user?.id ||
              user?.role.name === "Administrador") && (
              <div onClick={() => handleEditingProject(project)}>
                <EditIcon />
              </div>
            )}
            {user?.role.name === "Administrador" && (
              <div className={styles.visibilityControls}>
                {project.hidden ? (
                  <div
                    onClick={() => handleVisibilityChange(false)}
                    title="Hacer visible"
                  >
                    <ShowIcon className="large-icon" />
                  </div>
                ) : (
                  <div
                    onClick={() => handleVisibilityChange(true)}
                    title="Ocultar proyecto"
                  >
                    <HideIcon className="large-icon" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default React.memo(ProjectItem);
