import { useEffect, useState } from "react";
import { NotificationService } from "@/core/services/notification/notificationService";
import { NotificationProps } from "@/core/types";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      const notifications = await new NotificationService().getNotifications();
      setNotifications(notifications);
    };
    loadNotifications();
  }, []);

  return { notifications, setNotifications }; 
};
