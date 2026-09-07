import { useRouter } from "next/router";
import LikedFeeds from "./LikedFeeds/LikedFeeds";
import SavedPosts from "./SavedPosts/SavedPosts";

import UnderlineTabs from "@/components/UnderlineTabs/UnderlineTabs";

import styles from "./MyPage.module.scss";

type TabKey = "liked-feeds" | "saved-posts";

const TABS: { key: TabKey; label: string; hasSeparatorAfter?: boolean }[] = [
  { key: "liked-feeds", label: "좋아요한 그림" },
  { key: "saved-posts", label: "저장한 글" },
];

export default function MyPage() {
  const router = useRouter();
  const { tab } = router.query;
  const activeTab = (tab as TabKey) ?? "liked-feeds";

  const handleTabChange = (tabKey: TabKey) => {
    router.push(`?tab=${tabKey}`);
  };

  const getTabComponent = () => {
    switch (activeTab) {
      case "liked-feeds":
        return <LikedFeeds />;
      case "saved-posts":
        return <SavedPosts />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1 className={styles.title}>내 보관함</h1>
        <UnderlineTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />
        <div className={styles.content}>{getTabComponent()}</div>
      </div>
    </div>
  );
}
