import styles from "./MyPage.module.scss";
import { useRouter } from "next/router";
import LikedFeeds from "./LikedFeeds/LikedFeeds";
import SavedFeeds from "./SavedFeeds/SavedFeeds";
import SavedPosts from "./SavedPosts/SavedPosts";

export default function MyPage() {
  const router = useRouter();
  const { tab } = router.query;

  const getTabComponent = () => {
    switch (tab) {
      case "liked-feeds":
        return <LikedFeeds />;
      case "saved-feeds":
        return <SavedFeeds />;
      case "saved-posts":
        return <SavedPosts />;
      default:
        return null;
    }
  };

  const getTabClass = (tabName: string) => {
    return tab === tabName ? styles.selected : "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <section className={styles.navContainer}>
          <button
            className={`${styles.button} ${getTabClass("liked-feeds")}`}
            onClick={() => router.push("?tab=liked-feeds")}
          >
            좋아요한 그림
          </button>
          <button
            className={`${styles.button} ${getTabClass("saved-feeds")}`}
            onClick={() => router.push("?tab=saved-feeds")}
          >
            저장한 그림
          </button>
          <div className={styles.bar} />
          <button
            className={`${styles.button} ${getTabClass("saved-posts")}`}
            onClick={() => router.push("?tab=saved-posts")}
          >
            저장한 글
          </button>
        </section>
        {getTabComponent()}
      </div>
    </div>
  );
}
