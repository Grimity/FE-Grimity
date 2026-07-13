import { useMyLikeList } from "@/api/users/getMeLikeFeeds";

import MyFeedAlbumGrid from "../MyFeedAlbumGrid/MyFeedAlbumGrid";

export default function LikedFeeds() {
  const query = useMyLikeList({ size: 20 });

  return <MyFeedAlbumGrid query={query} emptyTitle="좋아요한 그림이 없어요" />;
}
