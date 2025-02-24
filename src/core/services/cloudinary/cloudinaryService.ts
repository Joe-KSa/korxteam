import { environment } from "@/environments/environment.prod"
import { DataService } from "../dataService";
import type { fileFromCloudProps } from "@/core/types";

export class CloudinaryService extends DataService {

  constructor() {
    super(environment.backEnd.baseUrl + "/api/upload");
  }

  async uploadImage(image: File): Promise<fileFromCloudProps | undefined> {
    const formData = new FormData();
    formData.append("image", image);

    try {
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

  async deleteImage(publicId: string) {
    try {
      const response = await fetch(`${this.url}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });
  
      return response.json();
    } catch (error) {
      this.handleError(error);
      return undefined;
    }
  }
  
}
