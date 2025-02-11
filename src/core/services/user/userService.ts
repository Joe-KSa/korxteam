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

      if (response.status === 200) {
        return await response.json();
      } else if (response.status === 403) {
        console.warn("User is banned");
        return null;
      } else if (response.status === 401) {
        // Silenciar el error y reintentar con el refresh token
        const tokenRefreshed = await TokenManager.refreshToken();
        if (!tokenRefreshed) return null; 

        const retryResponse = await fetch(`${this.url}`, {
          method: "GET",
          credentials: "include",
        });

        return retryResponse.ok ? await retryResponse.json() : null;
      }
      
      return null;
    } catch {
      // Silenciar errores inesperados sin imprimir en consola
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
