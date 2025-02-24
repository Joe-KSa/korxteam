import { environment } from "@/environments/environment.prod";

export class TokenManager {

  public static async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(
        `${environment.backEnd.baseUrl}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (!response.ok) {
        return false;
      }

      await response.json();
      return true;
    } catch (error) {
      console.error("Error al intentar renovar el token:", error);
      return false;
    }
  }

  // Cierra la sesión eliminando las cookies y notificando al backend
  public static async logout(): Promise<void> {
    try {
      const response = await fetch(
        `${environment.backEnd.baseUrl}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Error al cerrar sesión:", await response.text());
        throw new Error("Error al cerrar sesión");
      }

      console.log("Sesión cerrada exitosamente");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al intentar cerrar sesión:", error);
    }
  }
}
