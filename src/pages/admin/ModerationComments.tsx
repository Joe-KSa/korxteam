import { useState, useEffect, useCallback } from "react";
import { ProjectService } from "@/core/services/project/projectService";
import styles from "@/components/widget/styles/Comments.module.scss";
import Button, { ButtonStyle } from "@/components/common/Button";
import { RemoveIcon } from "@/assets/icons";

interface Comment {
  id: number;
  content: string;
  username: string;
  projectId: number;
  parentId: number;
  projectTitle: string;
  avatar: string;
  createdAt: string;
}

const ModerationCommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const loadComments = useCallback(async () => {
    try {
      const commentData = await new ProjectService().getAllComments();
      setComments(commentData);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, []);

  const handleRemoveComment = async (id: number) => {
    try {
      const response = await new ProjectService().removeComment(id);
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

  return (
    <div className={styles.moderationContainer}>
      {comments.map((comment) => (
        <div className={styles.CommentItem} key={comment.id}>
          <div className={`${styles.comment} ${styles.moderationComment}`}>
            <div className={styles.comment__wrapper}>
              <div className={styles.comment__wrapper__figure}>
                <div className={styles.comment__wrapper__figure__avatar}>
                  <img src={comment.avatar} />
                </div>
              </div>
              <div className={styles.comment__wrapper__info}>
                <div className={styles.comment__wrapper__info__header}>
                  <span>
                    @{comment.username} - {comment.projectTitle}
                  </span>
                </div>
                <div className={styles.comment__wrapper__info__body}>
                  <span>{comment.content}</span>
                </div>
              </div>
            </div>
            <Button
              styleType={ButtonStyle.ICON}
              onClick={() => handleRemoveComment(comment.id)}
            >
              <RemoveIcon />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModerationCommentsPage;
