import { apiClient } from "./client";
import type { BookDetail, PaginatedBooks } from "./types";

export interface ListBooksParams {
  page?: number;
  size?: number;
  category?: string;
  genre?: string;
  sort?: "rating" | "count" | "random";
  seed?: number;
}

export const booksApi = {
  list: (params: ListBooksParams = {}) => apiClient.get<PaginatedBooks>("/books", { params }),
  get: (id: number) => apiClient.get<BookDetail>(`/books/${id}`),
};
