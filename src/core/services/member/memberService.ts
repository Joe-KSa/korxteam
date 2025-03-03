import { environment } from "@/environments/environment.prod";
import { DataService } from "../dataService";
import type { getMemberProps, postMemberProps, apiResponse } from "../../types";

export class MemberService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/member");
  }

  async getMembers(
    sort: "asc" | "desc" = "asc",
    sortBy: string = "id"
  ): Promise<getMemberProps[]> {
    try {
      const response = await fetch(
        `${this.url}?sort=${sort}&sortBy=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getMember(id: number): Promise<getMemberProps | undefined> {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: "GET",
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
      return undefined;
    }
  }

  async getMemberByUsername(
    username: string
  ): Promise<getMemberProps | undefined> {
    try {
      const response = await fetch(`${this.url}/${username}`, {
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
      return undefined;
    }
  }

  async createMember(member: postMemberProps): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(member),
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

  async updateMember(
    id: number,
    memberData: Pick<
      postMemberProps,
      | "name"
      | "description"
      | "tags"
      | "github"
      | "primaryColor"
      | "secondaryColor"
      | "sound"
      | "images"
      | "phrase"
    >
  ): Promise<apiResponse> {
    try {
      // console.log("Renderizado desde el servidor", {id, memberData});
      const response = await fetch(`${this.url}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
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

  async deleteMember(id: number): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: "DELETE",
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
}
