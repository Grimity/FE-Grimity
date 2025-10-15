import styles from "./ChatListSkeleton.module.scss";

interface ChatListSkeletonProps {
  count?: number;
}

const ChatListSkeleton = ({ count = 3 }: ChatListSkeletonProps) => {
  return (
    <div className={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonItem}>
          <div className={styles.avatar} />
          <div className={styles.chatDetails}>
            <div className={styles.topRow}>
              <div className={styles.username} />
              <div className={styles.timestamp} />
            </div>
            <div className={styles.bottomRow}>
              <div className={styles.lastMessage} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListSkeleton;