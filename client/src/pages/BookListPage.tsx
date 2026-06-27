import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { booksApi, type ListBooksParams } from "../api/books";
import { BookListRow } from "../components/BookListRow";
import { Spinner } from "../components/Spinner";

interface BookListPageProps {
  title: string;
  subtitle?: string;
  sort: ListBooksParams["sort"];
  showRank?: boolean;
}

const PAGE_SIZE = 20;

export function BookListPage({ title, subtitle, sort, showRank }: BookListPageProps) {
  // "random" sort needs a stable seed so paginated fetches don't reshuffle and repeat/skip rows
  const [seed] = useState(() => Math.floor(Math.random() * 1_000_000));
  const randomSeed = sort === "random" ? seed : undefined;

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["books", "infinite", { sort, seed: randomSeed }],
    queryFn: ({ pageParam }) =>
      booksApi.list({ sort, page: pageParam, size: PAGE_SIZE, seed: randomSeed }).then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page * lastPage.size < lastPage.total ? lastPage.page + 1 : undefined),
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const books = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}

      {isLoading && <Spinner className="mt-6" />}
      {error && <p className="mt-6 text-red-600">책 목록을 불러오지 못했습니다.</p>}

      {!isLoading && !error && (
        <div className="mt-4">
          {books.map((book, i) => (
            <BookListRow key={book.id} book={book} rank={showRank ? i + 1 : undefined} />
          ))}
          {books.length === 0 && <p className="py-10 text-center text-stone-400">책이 없습니다.</p>}
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && <Spinner className="py-4" />}
      {!hasNextPage && books.length > 0 && (
        <p className="py-4 text-center text-sm text-stone-400">마지막 책까지 모두 봤습니다.</p>
      )}
    </div>
  );
}
