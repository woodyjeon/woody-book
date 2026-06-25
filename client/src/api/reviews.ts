import { apiClient } from "./client";
import type { Review } from "./types";

export interface ReviewCreatePayload {
  contents: string;
  rating: number;
  is_spoiler?: boolean;
}

export const reviewsApi = {
  list: (bookId: number) => apiClient.get<Review[]>(`/books/${bookId}/reviews`),
  create: (bookId: number, payload: ReviewCreatePayload) =>
    apiClient.post<Review>(`/books/${bookId}/reviews`, payload),
  remove: (bookId: number, reviewId: number) => apiClient.delete(`/books/${bookId}/reviews/${reviewId}`),
};
