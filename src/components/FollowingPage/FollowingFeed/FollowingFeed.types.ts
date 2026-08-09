import type { FollowingFeedsResponse } from "@/api/feeds/getFeedsFollowing";

export type FollowingFeedItem = FollowingFeedsResponse["feeds"][number];

export interface FollowingFeedProps {
  feed: FollowingFeedItem;
}
