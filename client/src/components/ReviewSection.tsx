import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { reviewsApi } from "../api/reviews";
import { useAuth } from "../context/AuthContext";
import { StarRatingInput } from "./StarRatingInput";

interface ReviewSectionProps {
  bookId: number;
}

export function ReviewSection({ bookId }: ReviewSectionProps) {
  const { isLoggedIn, member } = useAuth();
  const queryClient = useQueryClient();
  const [contents, setContents] = useState("");
  const [rating, setRating] = useState(5);
  const [isSpoiler, setIsSpoiler] = useState(false);

  const { data: reviews } = useQuery({
    queryKey: ["reviews", bookId],
    queryFn: () => reviewsApi.list(bookId).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: () => reviewsApi.create(bookId, { contents, rating, is_spoiler: isSpoiler }),
    onSuccess: () => {
      setContents("");
      setRating(5);
      setIsSpoiler(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => reviewsApi.remove(bookId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-bold text-stone-800">리뷰 {reviews?.length ?? 0}</h2>
      {isLoggedIn && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (contents.trim()) createMutation.mutate();
          }}
          className="mb-4 rounded-lg border border-stone-200 p-3"
        >
          <StarRatingInput value={rating} onChange={setRating} />
          <textarea
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="이 책에 대한 리뷰를 남겨보세요"
            rows={3}
            className="mt-2 w-full resize-none rounded border border-stone-300 p-2 text-sm"
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="flex items-center gap-1 text-xs text-stone-500">
              <input type="checkbox" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} />
              스포일러 포함
            </label>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded bg-violet-700 px-3 py-1.5 text-sm text-white hover:bg-violet-800 disabled:opacity-50"
            >
              등록
            </button>
          </div>
          {createMutation.isError && (
            <p className="mt-1 text-xs text-red-600">
              {isAxiosError(createMutation.error) && createMutation.error.response?.data?.detail
                ? createMutation.error.response.data.detail
                : "리뷰 등록에 실패했습니다."}
            </p>
          )}
        </form>
      )}
      <ul className="space-y-3">
        {reviews?.map((review) => (
          <li key={review.id} className="rounded-lg border border-stone-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-stone-800">{review.nickname}</span>
                <span className="text-xs text-violet-700">★ {review.rating?.toFixed(1)}</span>
                {review.is_spoiler && (
                  <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-600">스포일러</span>
                )}
              </div>
              {member?.id === review.member_id && (
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(review.id)}
                  className="text-xs text-stone-400 hover:text-red-600"
                >
                  삭제
                </button>
              )}
            </div>
            <p className="mt-1 whitespace-pre-line text-sm text-stone-700">{review.contents}</p>
          </li>
        ))}
        {reviews?.length === 0 && <p className="text-sm text-stone-400">아직 리뷰가 없습니다.</p>}
      </ul>
    </section>
  );
}
