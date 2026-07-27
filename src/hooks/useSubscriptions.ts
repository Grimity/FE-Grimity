import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getSubscribe,
  putSubscribe,
  SubscribeResponse,
  SubscriptionType,
} from "@/api/users/subscribe";

export const SUBSCRIPTIONS_QUERY_KEY = ["subscriptions"] as const;

const ALL_SUBSCRIPTION_TYPES: SubscriptionType[] = [
  "FOLLOW",
  "FEED_LIKE",
  "FEED_COMMENT",
  "FEED_REPLY",
  "POST_COMMENT",
  "POST_REPLY",
];

/**
 * 알림 구독 상태를 관리하는 공용 훅
 */
export function useSubscriptions() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEY,
    queryFn: getSubscribe,
  });

  const subscriptions = data?.subscription ?? [];

  const mutation = useMutation({
    mutationFn: putSubscribe,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY });
    },
  });

  const has = (type: SubscriptionType) => subscriptions.includes(type);
  const isAllOn = subscriptions.length === ALL_SUBSCRIPTION_TYPES.length;

  const setOptimistic = (next: SubscriptionType[]) => {
    queryClient.setQueryData<SubscribeResponse>(SUBSCRIPTIONS_QUERY_KEY, {
      subscription: next,
    });
  };

  const toggle = (type: SubscriptionType) => {
    const isSubscribed = has(type);
    setOptimistic(
      isSubscribed ? subscriptions.filter((sub) => sub !== type) : [...subscriptions, type],
    );
    mutation.mutate({ type: isSubscribed ? "ALL" : type });
  };

  const toggleAll = () => {
    setOptimistic(isAllOn ? [] : [...ALL_SUBSCRIPTION_TYPES]);
    mutation.mutate({ type: "ALL" });
  };

  return { subscriptions, isAllOn, has, toggle, toggleAll };
}
