import { environment } from "@/environments/environment.prod";
import { DataService } from "../dataService";
import { TokenManager } from "@/core/services/token/tokenService";

export class UserService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/user");
  }

  async getUser() {
    try {
      const response = await fetch(`${this.url}`, {
        method: "GET",
        credentials: "include",
      });

      // Procesar códigos de estado primero
      if (response.status === 200) {
        return await response.json(); // Usuario no baneado
      } else if (response.status === 403) {
        console.error("User is banned");
        return null;
      } else if (response.status === 401) {
        // Lógica de renovación de token..
        const tokenRefreshed = await TokenManager.refreshToken();
        if (!tokenRefreshed) return null; // Evita bucles infinitos

        const retryResponse = await fetch(`${this.url}`, {
          method: "GET",
          credentials: "include",
        });

        return retryResponse.ok ? await retryResponse.json() : null;
      }
      throw new Error("Error fetching user data");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async banUser(userId: number) {
    try {
      const response = await fetch(`${this.url}/${userId}/ban`, {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async unbanUser(userId: number) {
    try {
      const response = await fetch(`${this.url}/${userId}/unban`, {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async blockUser(username: string) {
    try {
      const response = await fetch(`${this.url}/${username}/block`, {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async unblockUser(username: string) {
    try {
      const response = await fetch(`${this.url}/${username}/unblock`, {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
