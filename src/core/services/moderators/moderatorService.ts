import { DataService } from "../dataService";
import { environment } from "@/environments/environment.prod";

export class ModeratorService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/moderator");
  }

  async getModerators() {
    try {
      const response = await fetch(`${this.url}/route`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      this.handleError(err);
      return [];
    }
  }

  async getModeratorById(id: string) {
    try {

      const response = await fetch(`${this.url}/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();

    } catch (err) {
      this.handleError(err);
      return null;
    }
  }
}
