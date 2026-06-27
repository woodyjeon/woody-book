import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wishesApi } from "../api/wishes";
import { useAuth } from "../context/AuthContext";
import type { BookDetail } from "../api/types";

interface WishButtonProps {
  bookId: number;
  isWished: boolean;
  wishCount: number;
}

export function WishButton({ bookId, isWished, wishCount }: WishButtonProps) {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => (isWished ? wishesApi.remove(bookId) : wishesApi.add(bookId)),
    onSuccess: () => {
      queryClient.setQueryData<BookDetail | undefined>(["book", bookId], (prev) =>
        prev
          ? { ...prev, is_wished: !isWished, wish_count: prev.wish_count + (isWished ? -1 : 1) }
          : prev,
      );
      queryClient.invalidateQueries({ queryKey: ["wishes", "mine"] });
    },
  });

  if (!isLoggedIn) {
    return (
      <span className="text-stone-400" title="로그인 후 위시리스트에 담을 수 있습니다.">
        ♡ 위시 {wishCount}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isWished ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
    >
      {isWished ? "♥" : "♡"} 위시 {wishCount}
    </button>
  );
}
