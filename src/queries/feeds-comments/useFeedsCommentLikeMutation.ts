import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCommentLike, putCommentLike } from "@/api/feeds-comments/putDeleteCommentsLike";
import type { FeedsCommentsResponse } from "@/api/feeds-comments/getFeedComments";

interface CommentLikeParams {
  feedId: string;
  commentId: string;
  isLiked: boolean;
}

function toggleLike<T extends { id: string; isLike: boolean; likeCount: number }>(
  comment: T,
  commentId: string,
  isLiked: boolean,
): T {
  if (comment.id !== commentId) return comment;

  return {
    ...comment,
    isLike: !isLiked,
    likeCount: Math.max(0, comment.likeCount + (isLiked ? -1 : 1)),
  };
}

/**
 * 댓글 좋아요. 하트와 개수는 캐시에서 바로 뒤집고, 실패하면 되돌린다.
 * 목록 전체를 다시 받아오지 않는다.
 */
export function useFeedsCommentLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, isLiked }: CommentLikeParams) =>
      isLiked ? deleteCommentLike(commentId) : putCommentLike(commentId),

    onMutate: async ({ feedId, commentId, isLiked }) => {
      const commentsKey = ["getFeedsComments", feedId];
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const previousComments = queryClient.getQueryData<FeedsCommentsResponse>(commentsKey);

      queryClient.setQueryData<FeedsCommentsResponse>(commentsKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: old.comments.map((comment) => ({
            ...toggleLike(comment, commentId, isLiked),
            childComments: comment.childComments.map((child) =>
              toggleLike(child, commentId, isLiked),
            ),
          })),
        };
      });

      return { previousComments };
    },

    onError: (_err, { feedId }, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["getFeedsComments", feedId], context.previousComments);
      }
    },
  });
}
