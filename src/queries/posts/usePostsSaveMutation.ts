import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePostsSave, putPostsSave } from "@/api/posts/putDeletePostsIdSave";

import type { PostDetailResponse, PostsResponse } from "@grimity/dto";

interface SaveMutationParams {
  id: string;
  isSaved: boolean;
}

type SearchPostWithSave = PostsResponse["posts"][number] & { isSave?: boolean };

export const usePostsSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isSaved }: SaveMutationParams) =>
      isSaved ? deletePostsSave(id) : putPostsSave(id),

    onMutate: async ({ id, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: ["PostSearch"] });
      await queryClient.cancelQueries({ queryKey: ["Postsdetails", id] });

      const previousSearches = queryClient.getQueriesData<PostsResponse>({
        queryKey: ["PostSearch"],
      });
      const previousDetail = queryClient.getQueryData<PostDetailResponse>(["Postsdetails", id]);

      queryClient.setQueriesData<PostsResponse>({ queryKey: ["PostSearch"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.map((post) =>
            post.id === id ? ({ ...post, isSave: !isSaved } as SearchPostWithSave) : post,
          ),
        };
      });

      queryClient.setQueryData<PostDetailResponse>(["Postsdetails", id], (old) => {
        if (!old) return old;
        return { ...old, isSave: !isSaved };
      });

      return { previousSearches, previousDetail };
    },

    onError: (_err, { id }, context) => {
      context?.previousSearches?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(["Postsdetails", id], context.previousDetail);
      }
    },

    // 상세는 무효화하지 않는다. GET /posts/{id}가 조회수를 올리기 때문에
    // 다시 받아오면 저장할 때마다 조회수가 함께 올라간다.
    // isSave는 onMutate에서 이미 정확한 값으로 써두었다.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["PostSearch"] });
      queryClient.invalidateQueries({ queryKey: ["MySavePost"] });
    },
  });
};
