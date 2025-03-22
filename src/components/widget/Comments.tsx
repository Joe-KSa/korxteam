import React, { useState, useCallback, useEffect, useMemo } from "react";
import styles from "./styles/Comments.module.scss";
import Button, { ButtonHoverStyle, ButtonStyle } from "../common/Button";
import { useProjects } from "@/hooks/useProjects";
import InputField from "../common/InputField";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { ReplyIcon, DeleteIcon } from "@/assets/icons";
import { ProjectService } from "@/core/services/project/projectService";
import { useUser } from "@/hooks/useUser";
import { useRoleStore } from "@/store/useRoleStore";
import DiscordLogo from "@/assets/DiscordLogo.jpg"

interface Comment {
  id: number;
  author: {
    username: string;
    avatar: string;
  };
  content: string;
  replyTo?: string;
  replies?: Comment[];
}

interface CommentsProps {
  width: number;
}

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onReply?: (author: string, commentId: number) => void;
  onRemove?: (commentId: number) => void;
  canModerate?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isReply = false,
  onReply,
  onRemove,
  canModerate = false,
}) => {
  const [showReplies, setShowReplies] = useState(false);


  return (
    <div className={styles.commentItem}>
      <div className={styles.comment}>
        <div className={styles.comment__wrapper}>
          <div className={styles.comment__wrapper__figure}>
            <div className={styles.comment__wrapper__figure__avatar}>
              <img
                src={comment.author.avatar}
                alt={`${comment.author.username} avatar`}
                onError={(e) => {
                  e.currentTarget.src = DiscordLogo
                  e.currentTarget.onerror = null;
              }}
              />
            </div>
            <div className={styles.actionsContainer}>
              {/* Ícono de reply */}
              <div
                className={styles.actionsContainer__inner}
                onClick={() =>
                  onReply && onReply(comment.author.username, comment.id)
                }
                style={{ cursor: "pointer" }}
              >
                <ReplyIcon className="medium-icon" />
              </div>
              {/* Ícono de delete, solo para moderadores */}
              {canModerate && (
                <div
                  className={styles.actionsContainer__inner}
                  onClick={() => onRemove && onRemove(comment.id)}
                  style={{ cursor: "pointer" }}
                >
                  <DeleteIcon className="medium-icon" />
                </div>
              )}
            </div>
          </div>
          <div className={styles.comment__wrapper__info}>
            <div className={styles.comment__wrapper__info__header}>
              <span>@{comment.author.username}</span>
            </div>
            <div className={styles.comment__wrapper__info__body}>
              <span>
                {typeof comment.replyTo === "string" ? (
                  <strong>@{comment.replyTo} </strong>
                ) : (
                  ""
                )}
                {comment.content}
              </span>
            </div>
          </div>
        </div>
      </div>
      {!isReply && comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          <div className={styles.replies__inner}>
            <div className={styles.replies__inner__decorator} />
            <div
              onClick={() => setShowReplies(!showReplies)}
              className={styles.replies__inner__text}
            >
              {showReplies
                ? "Ocultar respuestas"
                : `Ver las ${comment.replies.length} respuestas`}
            </div>
          </div>
          {showReplies && (
            <div className={styles.replies__content}>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  onReply={onReply}
                  onRemove={onRemove}
                  canModerate={canModerate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Comments: React.FC<CommentsProps> = ({ width }) => {
  const { selectedProject, setShowComments } = useProjects();
  const [comments, setComments] = useState<Comment[]>([]);
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [replyAuthor, setReplyAuthor] = useState<string | null>(null);
  const { user } = useUser();
  const { fetchUserRoles, hasPermission, permissions } = useRoleStore();

  const isDisabled = user?.role.name === "Bloqueado";

  const handleReply = (author: string, commentId: number) => {
    setParentCommentId(commentId);
    setReplyAuthor(author);
    setNewComment((prev) =>
      prev.includes(`@${author}`) ? prev : `@${author} `
    );
  };

  // Función para eliminar un comentario
  const handleRemoveComment = async (id: number) => {
    try {
      const response = await new ProjectService().removeComment(id);
      // Actualiza el estado eliminando el comentario (para comentarios de nivel superior)
      setComments(comments.filter((comment) => comment.id !== id));

      if (response?.success === true) {
        alert("Comentario eliminado correctamente");
      } else {
        alert("Error al eliminar el comentario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchUserRoles(user?.id);
  }, [user?.id, fetchUserRoles]);

  const canModerateUsers = useMemo(() => {
    return hasPermission("moderate:users");
  }, [permissions]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedProject?.id || !user) return;

    let contentToSend = newComment;
    if (replyAuthor) {
      const mentionRegex = new RegExp(`^@${replyAuthor}\\s*`);
      contentToSend = contentToSend.replace(mentionRegex, "");
    }

    try {
      const commentData = {
        content: contentToSend,
        userId: user.id,
        parentCommentId: parentCommentId || null,
      };

      const response = await new ProjectService().addCommentProject(
        selectedProject.id,
        commentData
      );

      if (response.success) {
        setNewComment("");
        setParentCommentId(null);
        setReplyAuthor(null);
      } else {
        alert("Error al enviar comentario. Intente nuevamente.");
      }

      // Recargar comentarios después de enviar uno nuevo
      loadProjectComments(selectedProject.id);
    } catch (error) {
      console.error("Error enviando comentario:", error);
    }
  };

  const loadProjectComments = useCallback(async (id: number) => {
    try {
      const projectCommentsData = await new ProjectService().getProjectComments(id);
      setComments(projectCommentsData);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedProject?.id) {
      loadProjectComments(selectedProject.id);
    }
  }, [selectedProject, loadProjectComments]);

  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.container__header}>
        <div className={styles.container__header__title}>
          <div style={{ paddingInlineStart: "6px" }}>
            <h1 style={{ fontSize: "16px" }}>{selectedProject?.title}</h1>
          </div>
          
        </div>
        <span className={styles.container__header__actions}>
          <Button styleType={ButtonStyle.ICON} onClick={() => setShowComments(false)}>
            <DeleteIcon className="medium-icon"/>
          </Button>
        </span>
      </div>
      <div className={styles.container__body}>
        <OverlayScrollbarsComponent
          options={{
            scrollbars: {
              autoHide: "scroll",
              autoHideDelay: 500,
            },
          }}
          style={{ height: "100%" }}
        >
          <div className={styles.container__body__comments}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onRemove={handleRemoveComment}
                canModerate={canModerateUsers}
              />
            ))}
          </div>
        </OverlayScrollbarsComponent>
        <div className={styles.userComment}>
          <div className={styles.userComment__wrapper}>
            <div className={styles.userComment__wrapper__inputContainer}>
              <InputField
                type="text"
                placeholder={"Añade un comentario"}
                value={newComment}
                maxLength={150}
                onChange={(value) => setNewComment(value)}
                disabled={!user || isDisabled}
              />
              <Button
                styleType={ButtonStyle.TEXT_ONLY}
                label="Comentar"
                hoverStyleType={ButtonHoverStyle.SCALE}
                backgroundColor="var(--background-elevated-highlight)"
                borderRadius="4px"
                onClick={handleSubmitComment}
                disabled={!user || isDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
