export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;

  constructor(success: boolean, data?: T, error?: string) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(data: T): ApiResponse<T> {
    return new ApiResponse(true, data);
  }

  static fail(error: string): ApiResponse<null> {
    return new ApiResponse(false, null, error);
  }
}
