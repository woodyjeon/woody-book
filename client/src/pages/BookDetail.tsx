import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { booksApi } from "../api/books";
import { CommentSection } from "../components/CommentSection";
import { ReviewSection } from "../components/ReviewSection";
import { Spinner } from "../components/Spinner";
import { WishButton } from "../components/WishButton";

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);

  const { data: book, isLoading, error } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => booksApi.get(bookId).then((res) => res.data),
    enabled: Number.isFinite(bookId),
  });

  if (isLoading) return <Spinner />;
  if (error || !book) return <p className="text-red-600">책을 찾을 수 없습니다.</p>;

  return (
    <div>
      <Link to="/" className="mb-4 inline-block text-sm text-stone-500 hover:text-violet-700">
        ← 목록으로
      </Link>
      <div className="flex flex-col gap-6 sm:flex-row">
        <img
          src={book.thumbnail ?? undefined}
          alt={book.title}
          className="w-48 flex-none self-start rounded-lg object-cover shadow-md sm:w-56"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-stone-800">{book.title}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {book.authors.map((a) => a.name).join(", ")}
            {book.publishers.length > 0 && ` · ${book.publishers.map((p) => p.name).join(", ")}`}
            {book.published_date && ` · ${book.published_date}`}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <span className="font-medium text-violet-700">★ {book.avg_rating.toFixed(1)}</span>
            <span className="text-stone-400">({book.count_rating}명 평가)</span>
            <WishButton bookId={book.id} isWished={book.is_wished} wishCount={book.wish_count} />
          </p>
          {(book.genres.length > 0 || book.keywords.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {book.genres.map((g) => (
                <span key={g.genre} className="rounded-full bg-violet-50 px-2.5 py-1 text-xs text-violet-700">
                  {g.genre}
                </span>
              ))}
              {book.keywords.map((k) => (
                <span key={k.keyword} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                  #{k.keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-stone-800">책 소개</h2>
        {book.introduce ? (
          <p className="max-w-2xl whitespace-pre-line leading-relaxed text-stone-700">{book.introduce}</p>
        ) : (
          <p className="text-sm text-stone-400">책 소개가 없습니다.</p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-stone-800">목차</h2>
        <p className="text-sm text-stone-400">목차 정보가 없습니다.</p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-stone-800">저자 소개</h2>
        <p className="text-sm text-stone-400">저자 소개 정보가 없습니다.</p>
      </section>

      <ReviewSection bookId={book.id} />
      <CommentSection bookId={book.id} />
    </div>
  );
}
