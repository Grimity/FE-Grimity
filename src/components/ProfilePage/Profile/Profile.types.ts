import type { UserProfileResponse } from "@grimity/dto";

export interface ProfileProps {
  isMyProfile: boolean;
  id: string;
  userData: UserProfileResponse;
  profileImage: string;
  onEditProfileImage: () => void;
  refetchUserData: () => void;
}
