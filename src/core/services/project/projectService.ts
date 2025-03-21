import { environment } from "@/environments/environment.prod";
import type {
  getProjectProps,
  postProjectProps,
  apiResponse,
  getMemberProps,
  PostComment,
} from "@/core/types";
import { DataService } from "../dataService";

export class ProjectService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/project");
  }

  async getProjects(): Promise<getProjectProps[]> {
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

  async getProjectById(projectId: number) {
    try {
      const response = await fetch(`${this.url}/${projectId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      this.handleError(error);
      return null;
    }
  }

  async createProject(project: Omit<postProjectProps, "hidden">): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
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

  async updateProject(
    projectId: number,
    project: Omit<postProjectProps, "hidden">
  ): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}/${projectId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
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

  async deleteProject(projectId: number): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}/${projectId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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

  // Members
  async getProjectMembers(projectId: number): Promise<getMemberProps[]> {
    try {
      const response = await fetch(`${this.url}/${projectId}/members`, {
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

  async updateProjectVisibility(projectId: number, hidden: boolean) {
    try {
      const response = await fetch(`${this.url}/${projectId}/visibility`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hidden }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.project;
    } catch (err) {
      console.error("Error updating visibility:", err);
      throw err;
    }
  }

  async getProjectComments(projectId: number) {
    try {
      const response = await fetch(`${this.url}/${projectId}/comments`, {
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

  async addCommentProject(projectId: number, comment: PostComment) {
    try {
      const response = await fetch(`${this.url}/${projectId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        return { success: false, message: errorMessage.error };
      }
      return { success: true };
    } catch (error: any) {
      this.handleError(error);
      return { success: false, message: error.message };
    }
  }

  async getAllComments() {
    try {
      const response = await fetch(
        `${environment.backEnd.baseUrl}/api/comments`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      this.handleError(error);
      return [];
    }
  }

  async removeComment(commentId: number) {
    try {
      const response = await fetch(
        `${environment.backEnd.baseUrl}/api/comments`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        return { success: false, message: errorMessage.error };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting comment:", error);
      this.handleError(error);
    }
  }

  // Likes

  // ProjectService.js
  async toggleLike(projectId: number, userId: string) {
    try {
      const response = await fetch(`${this.url}/${projectId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
