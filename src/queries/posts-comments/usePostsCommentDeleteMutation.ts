import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostDetailResponse } from "@grimity/dto";

import { deletePostsComments } from "@/api/posts-comments/deletePostsComment";

interface CommentDeleteParams {
  postId: string;
  commentId: string;
}

/** 댓글 삭제. 개수는 상세 캐시에서 바로 내리고, 실패하면 되돌린다. */
export function usePostsCommentDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: CommentDeleteParams) => deletePostsComments(commentId),

    onMutate: async ({ postId }) => {
      const detailKey = ["Postsdetails", postId];
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousDetail = queryClient.getQueryData<PostDetailResponse>(detailKey);

      queryClient.setQueryData<PostDetailResponse>(detailKey, (old) =>
        old ? { ...old, commentCount: Math.max(0, old.commentCount - 1) } : old,
      );

      return { previousDetail };
    },

    onError: (_err, { postId }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(["Postsdetails", postId], context.previousDetail);
      }
    },
  });
}
