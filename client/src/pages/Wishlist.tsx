import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { wishesApi } from "../api/wishes";
import { Spinner } from "../components/Spinner";

export function Wishlist() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["wishes", "mine"],
    queryFn: () => wishesApi.listMine({ size: 100 }).then((res) => res.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">내 위시리스트</h1>

      {isLoading && <Spinner className="mt-6" />}
      {error && <p className="mt-6 text-red-600">위시리스트를 불러오지 못했습니다.</p>}

      {data && data.items.length === 0 && (
        <p className="mt-10 text-center text-stone-400">아직 담은 책이 없습니다.</p>
      )}

      {data && data.items.length > 0 && (
        <div className="mt-4">
          {data.items.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="group flex gap-4 border-b border-stone-200 py-4 first:pt-0 last:border-b-0"
            >
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
                {book.introduce && <p className="mt-1.5 line-clamp-2 text-sm text-stone-500">{book.introduce}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
