import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { TokenPair } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem("access_token"),
  getRefreshToken: () => localStorage.getItem("refresh_token"),
  setTokens: (tokens: TokenPair) => {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
  },
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

export const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error("저장된 refresh token이 없습니다.");

  const { data } = await axios.post<TokenPair>(`${BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  tokenStorage.setTokens(data);
  return data.access_token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const accessToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch {
        tokenStorage.clearTokens();
      }
    }
    return Promise.reject(error);
  },
);
