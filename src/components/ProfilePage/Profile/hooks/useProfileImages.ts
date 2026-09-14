import { useEffect, useState } from "react";

import type { UserProfileResponse } from "@grimity/dto";

import { useCoverImage } from "@/hooks/useCoverImage";
import { useProfileImage } from "@/hooks/useProfileImage";

const DEFAULT_PROFILE_IMAGE = "/image/default.svg";
const DEFAULT_COVER_IMAGE = "/image/default-cover.png";

/**
 * 프로필·커버 이미지의 표시 상태를 관리한다.
 * 업로드 중에는 미리보기로 먼저 바꾸고, 서버 데이터가 갱신되면 그 값으로 맞춘다.
 */
export function useProfileImages(
  userData: UserProfileResponse | undefined,
  refetchUserData: () => void,
) {
  const [profileImage, setProfileImage] = useState(
    () => userData?.image || DEFAULT_PROFILE_IMAGE,
  );
  const [coverImage, setCoverImage] = useState(
    () => userData?.backgroundImage || DEFAULT_COVER_IMAGE,
  );

  useEffect(() => {
    setProfileImage(userData?.image || DEFAULT_PROFILE_IMAGE);
    setCoverImage(userData?.backgroundImage || DEFAULT_COVER_IMAGE);
  }, [userData]);

  const { handleAddCover, handleDeleteImage } = useCoverImage(
    refetchUserData,
    setCoverImage,
    userData,
  );

  const { handleFileChange } = useProfileImage(
    refetchUserData,
    setProfileImage,
    userData?.image || DEFAULT_PROFILE_IMAGE,
  );

  return {
    profileImage,
    coverImage,
    changeProfileImage: handleFileChange,
    addCover: handleAddCover,
    deleteCover: handleDeleteImage,
  };
}
