import { useRef } from "react";
import { Link } from "react-router-dom";
import type { BookListItem } from "../api/types";

interface BookCarouselProps {
  title: string;
  subtitle?: string;
  books: BookListItem[];
  moreLink?: string;
}

export function BookCarousel({ title, subtitle, books, moreLink }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-800">{title}</h2>
          {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {moreLink && (
            <Link
              to={moreLink}
              className="rounded-full px-3 py-1.5 text-sm text-stone-500 hover:bg-stone-100 hover:text-violet-700"
            >
              더보기 ›
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollBy(-600)}
            aria-label="이전"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-500 shadow-md transition hover:bg-violet-700 hover:text-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(600)}
            aria-label="다음"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-500 shadow-md transition hover:bg-violet-700 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth pb-2">
        {books.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`} className="group w-40 flex-none">
            <div className="relative overflow-hidden rounded-3xl bg-stone-100 shadow-sm transition group-hover:shadow-lg">
              <img
                src={book.thumbnail ?? undefined}
                alt={book.title}
                className="aspect-[3/4] w-40 object-cover transition duration-300 group-hover:scale-105"
              />
              {book.genres[0] && (
                <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-stone-700 shadow-sm backdrop-blur">
                  {book.genres[0].genre}
                </span>
              )}
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-stone-800 group-hover:text-violet-700">
              {book.title}
            </p>
            <p className="text-xs text-stone-500">
              ★ {book.avg_rating.toFixed(1)} ({book.count_rating})
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
