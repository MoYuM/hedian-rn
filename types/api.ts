export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page: number;
  size: number;
  search?: string;
  category?: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
}
