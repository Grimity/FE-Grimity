import { useState } from "react";
import { useRouter } from "next/router";

import { PopularUserResponse } from "@/api/users/getPopular";
import { useToast } from "@/hooks/useToast";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";

import UserCard from "@/components/common/Card/User/User";
import type { UserCardImages } from "@/components/common/Card/User/User.types";

export default function User({
  id,
  url,
  name,
  image,
  followerCount: initialFollowerCount,
  isFollowing: initialIsFollowing,
  thumbnails,
  isBlocked,
}: PopularUserResponse) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);

  const { mutateAsync: putFollow } = usePutFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await deleteFollow({ id });
        setIsFollowing(false);
        setFollowerCount((count) => count - 1);
      } else {
        await putFollow({ id });
        setIsFollowing(true);
        setFollowerCount((count) => count + 1);
      }
    } catch {
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  const images: UserCardImages = [
    { url: thumbnails[0] },
    { url: thumbnails[1] },
    { url: thumbnails[2] },
  ];

  return (
    <UserCard
      variant="default"
      avatarUrl={image ?? undefined}
      nickname={name}
      followerCount={followerCount}
      isFollowing={isFollowing}
      onFollowClick={isBlocked ? undefined : handleFollowToggle}
      images={images}
      onClick={() => router.push(`/${url}`)}
    />
  );
}
