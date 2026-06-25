import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "../api/comments";
import { useAuth } from "../context/AuthContext";

interface CommentSectionProps {
  bookId: number;
}

export function CommentSection({ bookId }: CommentSectionProps) {
  const { isLoggedIn, member } = useAuth();
  const queryClient = useQueryClient();
  const [contents, setContents] = useState("");

  const { data: comments } = useQuery({
    queryKey: ["comments", bookId],
    queryFn: () => commentsApi.list(bookId).then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: () => commentsApi.create(bookId, contents),
    onSuccess: () => {
      setContents("");
      queryClient.invalidateQueries({ queryKey: ["comments", bookId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => commentsApi.remove(bookId, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", bookId] }),
  });

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-bold text-stone-800">댓글 {comments?.length ?? 0}</h2>
      {isLoggedIn && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (contents.trim()) createMutation.mutate();
          }}
          className="mb-4 flex gap-2"
        >
          <input
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 rounded border border-stone-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-violet-700 px-3 py-2 text-sm text-white hover:bg-violet-800 disabled:opacity-50"
          >
            등록
          </button>
        </form>
      )}
      <ul className="space-y-2">
        {comments?.map((comment) => (
          <li key={comment.id} className="flex items-start justify-between rounded-lg bg-stone-100 p-2.5 text-sm">
            <div>
              <span className="font-medium text-stone-800">{comment.nickname}</span>
              <span className="ml-2 text-stone-600">{comment.contents}</span>
            </div>
            {member?.id === comment.member_id && (
              <button
                type="button"
                onClick={() => deleteMutation.mutate(comment.id)}
                className="ml-2 flex-none text-xs text-stone-400 hover:text-red-600"
              >
                삭제
              </button>
            )}
          </li>
        ))}
        {comments?.length === 0 && <p className="text-sm text-stone-400">아직 댓글이 없습니다.</p>}
      </ul>
    </section>
  );
}
