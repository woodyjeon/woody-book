import { apiClient } from "./client";
import type { Comment } from "./types";

export const commentsApi = {
  list: (bookId: number) => apiClient.get<Comment[]>(`/books/${bookId}/comments`),
  create: (bookId: number, contents: string) => apiClient.post<Comment>(`/books/${bookId}/comments`, { contents }),
  remove: (bookId: number, commentId: number) => apiClient.delete(`/books/${bookId}/comments/${commentId}`),
};
