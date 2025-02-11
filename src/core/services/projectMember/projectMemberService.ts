import { environment } from "@/environments/environment.prod";
import type { apiResponse } from "@/core/types";
import { DataService } from "../dataService";
import type {
  getMemberProps,
  postProjectMemberData,
} from "../../types";

export class ProjectMemberService extends DataService {
  private token?: string;

  constructor(token?: string) {
    super(environment.backEnd.baseUrl + "/api/projectMember");
    this.token = token;
  }

  async getProjectMembers(projectId: number): Promise<getMemberProps[]> {
    try {
      const response = await fetch(`${this.url}/${projectId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      this.handleError(error);
      return [];
    }
  }

  async addMembersToProject(data: postProjectMemberData): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        return { success: false, message: errorMessage.error };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async removeMemberFromProject(
    projectId: number,
    memberId: number
  ): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}`, {
        method: "DELETE",
        credentials: "include", 
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, memberId }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        return { success: false, message: errorMessage.error };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
