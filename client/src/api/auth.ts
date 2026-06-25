import { apiClient } from "./client";
import type { Member, TokenPair } from "./types";

export interface RegisterPayload {
  user_id: string;
  password: string;
  email: string;
  nickname: string;
}

export interface LoginPayload {
  user_id: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) => apiClient.post<Member>("/auth/register", payload),
  login: (payload: LoginPayload) => apiClient.post<TokenPair>("/auth/login", payload),
  me: () => apiClient.get<Member>("/auth/me"),
  googleLoginUrl: () => `${apiClient.defaults.baseURL}/auth/google/login`,
};
