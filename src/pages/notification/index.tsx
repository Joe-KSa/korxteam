import styles from "./styles/Notification.module.scss";
import { useNotifications } from "@/hooks/useNotification";
import { formatDate } from "@/utils/formatDate";
import Button, { ButtonStyle } from "@/components/common/Button";
import { NotificationService } from "@/core/services/notification/notificationService";

const NotificationPage = () => {
  const { notifications, setNotifications } = useNotifications();

const handleNotification = async (notificationId: number, response: string) => {
  const notificationService = new NotificationService();
  const result = await notificationService.respondToNotification(notificationId, response);

  if (result?.success) {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }
};

  return (
    <main className={styles.container}>
      <section className={styles.container__inner}>
        <div className={styles.container__inner__presentation}>
          <h1>Notificaciones</h1>
          <p>Invitaciones y otras actividades de la página.</p>
        </div>
        <div className={styles.container__inner__notifications}>
          {notifications.map((notification, index) => (
            <div key={index} className={styles.notification}>
              <hr />
              <div className={styles.notification__inner}>
                <div className={styles.notification__inner__image}>
                  <div className={styles.imageContent}>
                    <div className={styles.imageContent__wrapper}>
                      <img
                        src={notification.project.image}
                        alt=""
                        draggable="false"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.notification__inner__info}>
                  <div className={styles.infoContent}>
                    <div className={styles.infoContent__details}>
                      <p>
                        Te han invitado al proyecto {notification.project.title}
                      </p>
                      <div className={styles.infoContent__details__sender}>
                        <img src={notification.sender.image} alt="" />
                        <span>{notification.sender.name}</span>
                      </div>
                    </div>
                    <div className={styles.infoContent__date}>
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                </div>
                <div className={styles.buttons}>
                  <Button
                    styleType={ButtonStyle.TEXT_ONLY}
                    onClick={() => handleNotification(notification.id, "accepted")}
                    label="Aceptar"
                    border
                    borderRadius="4px"
                    padding="4px 8px"
                  />
                  <Button
                    styleType={ButtonStyle.TEXT_ONLY}
                    onClick={() => handleNotification(notification.id, "rejected")}
                    label="Rechazar"
                    border
                    borderRadius="4px"
                    padding="4px 8px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default NotificationPage;
