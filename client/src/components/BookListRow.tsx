import { Link } from "react-router-dom";
import type { BookListItem } from "../api/types";

interface BookListRowProps {
  book: BookListItem;
  rank?: number;
}

export function BookListRow({ book, rank }: BookListRowProps) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex gap-4 border-b border-stone-200 py-4 first:pt-0 last:border-b-0"
    >
      {rank !== undefined && <span className="w-6 flex-none text-center text-xl font-bold text-violet-700">{rank}</span>}
      <img
        src={book.thumbnail ?? undefined}
        alt={book.title}
        className="aspect-[3/4] w-20 flex-none rounded object-cover shadow-sm sm:w-24"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-stone-800 group-hover:text-violet-700">{book.title}</p>
        <p className="mt-1 text-sm text-stone-500">
          {book.authors.map((a) => a.name).join(", ")}
          {book.category && ` · ${book.category}`}
        </p>
        <p className="mt-1 text-sm text-violet-700">
          ★ {book.avg_rating.toFixed(1)} <span className="text-stone-400">({book.count_rating}명 평가)</span>
        </p>
        {book.genres.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {book.genres.map((g) => (
              <span key={g.genre} className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
                {g.genre}
              </span>
            ))}
          </div>
        )}
        {book.introduce && <p className="mt-1.5 line-clamp-2 text-sm text-stone-500">{book.introduce}</p>}
      </div>
    </Link>
  );
}
