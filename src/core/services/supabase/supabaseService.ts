import { environment } from "@/environments/environment.prod";
import { DataService } from "../dataService";
import type { fileFromSupabaseProps } from "@/core/types";

export class SupabaseService extends DataService {
  constructor() {
    super(environment.backEnd.baseUrl + "/api/upload-sound");
  }

  async uploadAudio(sound: File): Promise<fileFromSupabaseProps | undefined> {
    try {
      const formData = new FormData();
      formData.append("sound", sound);

      console.log(formData.get("sound"));

      const response = await fetch(`${this.url}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading image: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error);
      return undefined;
    }
  }

  async deleteAudio(soundPath: string) {
    try {
      const response = await fetch(`${this.url}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ soundPath }),
      });

      return response.json();
    } catch (error) {
      this.handleError(error);
      return undefined;
    }
  }
}
