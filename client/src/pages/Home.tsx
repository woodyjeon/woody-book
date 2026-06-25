import { useQuery } from "@tanstack/react-query";
import { booksApi } from "../api/books";
import { BookRanking } from "../components/BookRanking";
import { BookCarousel } from "../components/BookCarousel";
import { PromoMarquee } from "../components/PromoMarquee";

export function Home() {
  const ranking = useQuery({
    queryKey: ["books", { sort: "count" }],
    queryFn: () => booksApi.list({ sort: "count", size: 10 }).then((res) => res.data),
  });
  const bestseller = useQuery({
    queryKey: ["books", { sort: "rating" }],
    queryFn: () => booksApi.list({ sort: "rating", size: 10 }).then((res) => res.data),
  });
  const recommend = useQuery({
    queryKey: ["books", { sort: "random" }],
    queryFn: () => booksApi.list({ sort: "random", size: 10 }).then((res) => res.data),
  });

  const isLoading = ranking.isLoading || bestseller.isLoading || recommend.isLoading;
  const error = ranking.error || bestseller.error || recommend.error;

  if (isLoading) return <p className="text-stone-500">불러오는 중...</p>;
  if (error) return <p className="text-red-600">책 목록을 불러오지 못했습니다.</p>;

  return (
    <div>
      <BookRanking title="도서 순위" books={ranking.data?.items ?? []} moreLink="/ranking" />
      <BookCarousel
        title="베스트셀러"
        subtitle="평점 높은 책"
        books={bestseller.data?.items ?? []}
        moreLink="/bestseller"
      />
      <PromoMarquee />
      <BookCarousel
        title="이런 책 어때요?"
        subtitle="당신을 위한 추천"
        books={recommend.data?.items ?? []}
        moreLink="/recommend"
      />
    </div>
  );
}
