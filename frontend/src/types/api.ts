export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'; 