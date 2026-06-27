export interface Member {
  id: number;
  user_id: string | null;
  nickname: string;
  email: string | null;
  introduce: string | null;
  gender: "F" | "M" | null;
  platform: "local" | "google";
  profile_image: string | null;
  is_public: boolean;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Author {
  name: string;
}

export interface Publisher {
  name: string;
}

export interface Genre {
  genre: string;
}

export interface Keyword {
  keyword: string;
}

export interface BookListItem {
  id: number;
  title: string;
  thumbnail: string | null;
  category: string | null;
  introduce: string | null;
  is_adult: boolean;
  authors: Author[];
  genres: Genre[];
  avg_rating: number;
  count_rating: number;
}

export interface BookDetail extends BookListItem {
  isbn: string | null;
  published_date: string | null;
  publishers: Publisher[];
  keywords: Keyword[];
  wish_count: number;
  is_wished: boolean;
}

export interface WishStatus {
  is_wished: boolean;
}

export interface WishedBook {
  id: number;
  title: string;
  thumbnail: string | null;
  category: string | null;
  introduce: string | null;
  is_adult: boolean;
  authors: Author[];
  genres: Genre[];
}

export interface PaginatedWishes {
  items: WishedBook[];
  page: number;
  size: number;
  total: number;
}

export interface PaginatedBooks {
  items: BookListItem[];
  page: number;
  size: number;
  total: number;
}

export interface Review {
  id: number;
  member_id: number;
  nickname: string;
  contents: string | null;
  rating: number | null;
  is_spoiler: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  member_id: number;
  nickname: string;
  contents: string;
  created_at: string;
}
