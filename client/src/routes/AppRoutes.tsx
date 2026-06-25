import { Route, Routes } from "react-router-dom";
import { Layout } from "../components/Layout";
import { BookDetail } from "../pages/BookDetail";
import { BookListPage } from "../pages/BookListPage";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { OAuthCallback } from "../pages/OAuthCallback";
import { Register } from "../pages/Register";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="oauth" element={<OAuthCallback />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route
          path="ranking"
          element={<BookListPage title="도서 순위" subtitle="평가 많은 책 순서" sort="count" showRank />}
        />
        <Route
          path="bestseller"
          element={<BookListPage title="베스트셀러" subtitle="평점 높은 책" sort="rating" />}
        />
        <Route
          path="recommend"
          element={<BookListPage title="이런 책 어때요?" subtitle="당신을 위한 추천" sort="random" />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
