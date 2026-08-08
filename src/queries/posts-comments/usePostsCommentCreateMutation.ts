import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePostCommentRequest, PostDetailResponse } from "@grimity/dto";

import { postPostsComments } from "@/api/posts-comments/postPostsComments";

/**
 * 댓글·답글 작성.
 * 개수는 서버 응답을 기다리지 않고 게시글 상세 캐시에서 바로 올린다.
 * (댓글 섹션 제목과 하단 반응 바가 이 값을 공유한다)
 * 목록은 서버가 만든 id가 필요해서 호출부에서 따로 refetch 한다.
 */
export function usePostsCommentCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostCommentRequest) => postPostsComments(data),

    onMutate: async ({ postId }) => {
      const detailKey = ["Postsdetails", postId];
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previousDetail = queryClient.getQueryData<PostDetailResponse>(detailKey);

      queryClient.setQueryData<PostDetailResponse>(detailKey, (old) =>
        old ? { ...old, commentCount: old.commentCount + 1 } : old,
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
