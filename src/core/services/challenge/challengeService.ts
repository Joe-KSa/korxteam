import { environment } from "@/environments/environment.prod";
import type {
  apiResponse,
  ChallengeProps,
  ChallengeSolutionsResponse,
  getChallengesProps,
  getSolutionsProps,
  getUserChallengesProps,
  postChallengeProps,
  tagProps,
} from "@/core/types";
import { DataService } from "../dataService";
import { getCompilerVersions } from "@/utils/languageUtils";

export class ChallengeService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/challenge");
  }

  async getChallenges(): Promise<getChallengesProps[]> {
    try {
      const response = await fetch(`${this.url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: getChallengesProps[] = await response.json();

      return data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getChallenge(id: number): Promise<ChallengeProps> {
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
      const data: ChallengeProps = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      return {} as ChallengeProps;
    }
  }

  async getLanguageHint(id: number, language: string): Promise<ChallengeProps> {
    try {
      const response = await fetch(`${this.url}/${id}/${language}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ChallengeProps = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      return {} as ChallengeProps;
    }
  }

  async getChallengesByUserId(userId: string) {
    try {
      const response = await fetch(`${this.url}/user/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: getUserChallengesProps[] = await response.json();

      return data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getChallengeDisciplines() {
    try {
      const response = await fetch(`${this.url}/disciplines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: tagProps[] = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async postChallenge(challenge: postChallengeProps) {
    try {
      const response = await fetch(`${this.url}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challenge),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ChallengeProps = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      return {} as ChallengeProps;
    }
  }

  async updateChallenge(id: number, challenge: postChallengeProps) {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challenge),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ChallengeProps = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      return {} as ChallengeProps;
    }
  }

  async deleteChallenge(id: number): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}/${id}`, {
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
      this.handleError(error);
      return { success: false, message: error.message };
    }
  }

  async deleteChallengeLanguage(
    id: string,
    language: string
  ): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}/${id}/${language}`, {
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
      this.handleError(error);
      return { success: false, message: error.message };
    }
  }

  async getChallengeSolutions(
    id: string,
    language: string
  ): Promise<ChallengeSolutionsResponse> {
    try {
      const response = await fetch(`${this.url}/${id}/solutions/${language}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ChallengeSolutionsResponse = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      // Retornamos un objeto que cumpla la interfaz ChallengeSolutionsResponse
      return { solutions: [], availableLanguages: [] };
    }
  }

  async postChallengeSolution(
    id: string,
    language: string,
    code: string
  ): Promise<apiResponse> {
    try {
      const response = await fetch(`${this.url}/${id}/solution/${language}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
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

  async getSolution(
    id: string,
    language: string
  ): Promise<getSolutionsProps | null> {
    try {
      const response = await fetch(`${this.url}/${id}/solution/${language}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: getSolutionsProps = await response.json();
      return data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async executeCode(language: string, sourceCode: string) {

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          version: getCompilerVersions[language],
          files: [
            {
              name: "main",
              content: sourceCode
            }
          ],
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error ejecutando el código:", error);
      return null;
    }
  }
}
