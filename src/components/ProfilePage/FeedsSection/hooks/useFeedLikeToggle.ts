import { useQueryClient, type InfiniteData } from "@tanstack/react-query";

import { useFeedLike, useFeedUnlike } from "@/api/generated/feeds/feeds";
import type { getUserGetFeedsInfiniteQueryKey } from "@/api/generated/users/users";
import type { UserFeedsResponse } from "@/api/generated/model";
import { useAuthStore } from "@/states/authStore";
import { useToast } from "@/hooks/useToast";

type FeedsQueryKey = ReturnType<typeof getUserGetFeedsInfiniteQueryKey>;

/**
 * 그림 목록의 좋아요를 낙관적으로 토글한다. 요청이 실패하면 이전 목록으로 되돌린다.
 */
export function useFeedLikeToggle(feedsQueryKey: FeedsQueryKey) {
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showToast } = useToast();

  const { mutate: likeFeed } = useFeedLike();
  const { mutate: unlikeFeed } = useFeedUnlike();

  return (feedId: string, isLiked: boolean) => {
    if (!isLoggedIn) {
      showToast("로그인 후 좋아요를 누를 수 있어요.", "error");
      return;
    }

    const previousData =
      queryClient.getQueryData<InfiniteData<UserFeedsResponse>>(feedsQueryKey);

    queryClient.setQueryData<InfiniteData<UserFeedsResponse>>(feedsQueryKey, (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          feeds: page.feeds.map((feed) =>
            feed.id === feedId
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

    const rollback = () => {
      if (previousData) queryClient.setQueryData(feedsQueryKey, previousData);
    };

    if (isLiked) {
      unlikeFeed({ id: feedId }, { onError: rollback });
    } else {
      likeFeed({ id: feedId }, { onError: rollback });
    }
  };
}
