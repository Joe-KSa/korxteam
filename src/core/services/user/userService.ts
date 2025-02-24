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

  async getUserPermissions(userId: string) {
    try {
      const response = await fetch(`${this.url}/${userId}/permissions`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async banUser(userId: string) {
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

  async updateBlockUser(username: string, action: string) {
    try {
      const response = await fetch(`${this.url}/${username}/toggle-block`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
