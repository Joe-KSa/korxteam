import { environment } from "@/environments/environment.prod";
import type { roleProps } from "@/core/types";
import { DataService } from "../dataService";

export class RoleService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/role");
  }

  async getRoles(): Promise<roleProps[]> {
    try {
      const response = await fetch(`${this.url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
}
