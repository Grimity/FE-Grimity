import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putFeedsLike } from "@/api/feeds/putFeedsLike";
import { deleteFeedsLike } from "@/api/feeds/deleteFeedsLike";
import type {
  FeedDetailResponse,
  FeedRankingsResponse,
  SearchedFeedsResponse,
} from "@grimity/dto";

interface LikeMutationParams {
  id: string;
  isLiked: boolean;
}

interface FeedSearchInfiniteData {
  pages: SearchedFeedsResponse[];
  pageParams: unknown[];
}

export const useFeedsLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isLiked }: LikeMutationParams) =>
      isLiked ? deleteFeedsLike(id) : putFeedsLike(id),

    onMutate: async ({ id, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["details", id] });
      await queryClient.cancelQueries({ queryKey: ["FeedSearch"] });
      await queryClient.cancelQueries({ queryKey: ["Rankings"] });

      const previousDetail = queryClient.getQueryData<FeedDetailResponse>(["details", id]);
      const previousSearches = queryClient.getQueriesData<FeedSearchInfiniteData>({
        queryKey: ["FeedSearch"],
      });
      const previousRankings = queryClient.getQueriesData<FeedRankingsResponse>({
        queryKey: ["Rankings"],
      });

      queryClient.setQueryData<FeedDetailResponse>(["details", id], (old) => {
        if (!old) return old;
        return {
          ...old,
          isLike: !isLiked,
          likeCount: isLiked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      queryClient.setQueriesData<FeedSearchInfiniteData>({ queryKey: ["FeedSearch"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            feeds: page.feeds.map((feed) =>
              feed.id === id
                ? {
                    ...feed,
                    isLike: !isLiked,
                    likeCount: isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
                  }
                : feed,
            ),
          })),
        };
      });

      queryClient.setQueriesData<FeedRankingsResponse>({ queryKey: ["Rankings"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          feeds: old.feeds.map((feed) =>
            feed.id === id
              ? {
                  ...feed,
                  isLike: !isLiked,
                  likeCount: isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
                }
              : feed,
          ),
        };
      });

      return { previousDetail, previousSearches, previousRankings };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(["details", id], context.previousDetail);
      }
      context?.previousSearches?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousRankings?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["details", id] });
      queryClient.invalidateQueries({ queryKey: ["feedsLatest"] });
      queryClient.invalidateQueries({ queryKey: ["FollowingFeeds"] });
      queryClient.invalidateQueries({ queryKey: ["MyLikeList"] });
      queryClient.invalidateQueries({ queryKey: ["Rankings"] });
      queryClient.invalidateQueries({ queryKey: ["FeedSearch"] });
    },
  });
};
