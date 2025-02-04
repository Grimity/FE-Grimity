import { useCallback, useEffect, useRef, useState } from "react";
import { usePopular } from "@/api/users/getPopular";
import styles from "./PopularUser.module.scss";
import Title from "@/components/Layout/Title/Title";
import Loader from "@/components/Layout/Loader/Loader";
import User from "./User/User";

export default function PopularUser() {
  const { data, isLoading } = usePopular();
  const [randomUsers, setRandomUsers] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      const randomData = [...data].sort(() => Math.random() - 0.5).slice(0, 5);
      setRandomUsers(randomData);
    }
  }, [data]);

  if (isLoading) return <Loader />;

  // 가로 스크롤 시 세로 스크롤 막기
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isScrollable = container.scrollWidth > container.clientWidth;

    if (!isScrollable) return;

    e.preventDefault();
    container.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div className={styles.container}>
      <Title>인기 유저</Title>
      <div className={styles.cardContainer} ref={containerRef}>
        {randomUsers?.map((user) => (
          <div key={user.tagName} className={styles.slide}>
            <User
              id={user.id}
              name={user.name}
              image={user.image}
              followerCount={user.followerCount}
              isFollowing={user.isFollowing}
              thumbnails={user.thumbnails}
            />
          </div>
        ))}
      </div>
      <div className={styles.lastGradient} />
    </div>
  );
}
