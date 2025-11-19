export interface AuthState {
  token: string;
  authenticated: boolean;
  error: string | null;
  loading: boolean;
  userId: number | null;
  userRole: string | null;
}

export const base_localhost_URL = "http://localhost:5182/api";
