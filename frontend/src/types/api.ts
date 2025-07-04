export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  timestamp: string;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ApiValidationError {
  success: false;
  message: string;
  errors: ValidationError[];
  timestamp: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'; 