import { useMemo, useState } from "react";
import { useRouter } from "next/router";

import { usePopular } from "@/api/users/getPopular";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/states/authStore";

import UserCard from "@/components/common/Card/User/User";

import styles from "./PopularUsers.module.scss";

const MAX_USERS = 6;

export default function PopularUsers() {
  const router = useRouter();
  const { showToast } = useToast();
  const user_id = useAuthStore((state) => state.user_id);

  const { data } = usePopular();
  const { mutateAsync: putFollow } = usePutFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const [followOverrides, setFollowOverrides] = useState<Record<string, boolean>>({});

  const users = useMemo(
    () =>
      [...(data ?? [])]
        .filter((user) => user.id !== user_id)
        .sort(() => Math.random() - 0.5)
        .slice(0, MAX_USERS),
    [data, user_id],
  );

  if (users.length === 0) return null;

  const handleFollowClick = async (id: string, isFollowing: boolean) => {
    setFollowOverrides((prev) => ({ ...prev, [id]: !isFollowing }));

    try {
      if (isFollowing) {
        await deleteFollow({ id });
      } else {
        await putFollow({ id });
      }
    } catch {
      setFollowOverrides((prev) => ({ ...prev, [id]: isFollowing }));
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>인기 작가</h2>
      <div className={styles.grid}>
        {users.map((user) => {
          const isFollowing = followOverrides[user.id] ?? user.isFollowing;

          return (
            <UserCard
              key={user.id}
              avatarUrl={user.image ?? undefined}
              nickname={user.name}
              followerCount={user.followerCount}
              isFollowing={isFollowing}
              onFollowClick={() => handleFollowClick(user.id, isFollowing)}
              onClick={() => router.push(`/${user.url}`)}
              images={[
                { url: user.thumbnails[0] },
                { url: user.thumbnails[1] },
                { url: user.thumbnails[2] },
              ]}
            />
          );
        })}
      </div>
    </section>
  );
}
