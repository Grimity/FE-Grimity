import { useMySaveList } from "@/api/users/getMeSaveFeeds";

import MyFeedAlbumGrid from "../MyFeedAlbumGrid/MyFeedAlbumGrid";

export default function SavedFeeds() {
  const query = useMySaveList({ size: 20 });

  return <MyFeedAlbumGrid query={query} emptyTitle="저장한 그림이 없어요" />;
}
