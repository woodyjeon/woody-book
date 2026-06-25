import { Link } from "react-router-dom";
import type { BookListItem } from "../api/types";

interface BookRankingProps {
  title: string;
  books: BookListItem[];
  moreLink?: string;
}

export function BookRanking({ title, books, moreLink }: BookRankingProps) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-800">{title}</h2>
        {moreLink && (
          <Link
            to={moreLink}
            className="rounded-full px-3 py-1.5 text-sm text-stone-500 hover:bg-stone-100 hover:text-violet-700"
          >
            더보기 ›
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {books.map((book, i) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="group flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-violet-50 text-sm font-bold text-violet-700">
              {i + 1}
            </span>
            <img
              src={book.thumbnail ?? undefined}
              alt={book.title}
              className="h-16 w-12 flex-none rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-stone-800 group-hover:text-violet-700">{book.title}</p>
              <p className="text-xs text-stone-500">
                ★ {book.avg_rating.toFixed(1)} ({book.count_rating})
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
