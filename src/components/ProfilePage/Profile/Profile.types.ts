import type { ChangeEvent } from "react";
import type { UserProfileResponse } from "@grimity/dto";

export interface ProfileProps {
  isMyProfile: boolean;
  id: string;
  userData: UserProfileResponse;
  profileImage: string;
  onChangeProfileImage: (event: ChangeEvent<HTMLInputElement>) => void;
  refetchUserData: () => void;
}
