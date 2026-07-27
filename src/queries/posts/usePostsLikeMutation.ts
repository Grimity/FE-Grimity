import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putPostsLike } from "@/api/posts/putPostsLike";
import { deletePostsLike } from "@/api/posts/deletePostsLike";
import type { PostDetailResponse } from "@grimity/dto";

interface LikeMutationParams {
  id: string;
  isLiked: boolean;
}

export const usePostsLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: LikeMutationParams) =>
      isLiked ? deletePostsLike(id) : putPostsLike(id),

    onMutate: async ({ id, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["Postsdetails", id] });
      const previousDetail = queryClient.getQueryData<PostDetailResponse>(["Postsdetails", id]);

      queryClient.setQueryData<PostDetailResponse>(["Postsdetails", id], (old) => {
        if (!old) return old;
        return {
          ...old,
          isLike: !isLiked,
          likeCount: isLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      return { previousDetail };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(["Postsdetails", id], context.previousDetail);
      }
    },

    // 상세는 무효화하지 않는다. GET /posts/{id}가 조회수를 올리기 때문에
    // 다시 받아오면 좋아요를 누를 때마다 조회수가 함께 올라간다.
    // isLike·likeCount는 onMutate에서 이미 정확한 값으로 써두었다.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["postsLatest"] });
    },
  });
};
