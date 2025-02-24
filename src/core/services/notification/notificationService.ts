import { DataService } from "../dataService";
import { environment } from "@/environments/environment.prod";

export class NotificationService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/notification");
  }

  async getNotifications(): Promise<any> {
    try {
      const response = await fetch(`${this.url}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async respondToNotification(notificationId: number, response: string) {
    try {
      const res = await fetch(`${this.url}/${notificationId}/respond`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }
}
