export class DataService {
  constructor(protected url: string) {}

  protected handleError(error: any): void {
    if (error.status === 400) {
      console.error("Bad Request:", error.message);
      return;
    }

    if (error.status === 404) {
      console.error("Resource not found");
      return;
    }
    if (error.status === 409) {
      console.error("Resource already exists");
      return;
    }
    if (error.status === 401) {
      console.error("Unauthorized");
      return;
    }

    if (error.status === 500) {
      console.error("Internal Server Error");
      return;
    }
    console.error("An unexpected error occurred:", error.message);
  }
}
