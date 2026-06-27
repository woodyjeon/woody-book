import { apiClient } from "./client";
import type { PaginatedWishes, WishStatus } from "./types";

export const wishesApi = {
  getStatus: (bookId: number) => apiClient.get<WishStatus>(`/books/${bookId}/wish`),
  add: (bookId: number) => apiClient.post<WishStatus>(`/books/${bookId}/wish`),
  remove: (bookId: number) => apiClient.delete(`/books/${bookId}/wish`),
  listMine: (params: { page?: number; size?: number } = {}) =>
    apiClient.get<PaginatedWishes>("/wishes", { params }),
};
