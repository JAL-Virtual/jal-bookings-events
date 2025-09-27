export interface Pagination<T> {
  page: number;
  perPage: number;
  total: number;
  data: T[];
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  vid: string;
  email?: string;
}
