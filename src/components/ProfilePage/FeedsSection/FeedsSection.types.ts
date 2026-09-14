import type { UserProfileResponse } from "@grimity/dto";

export interface FeedsSectionProps {
  userId: string;
  isMyProfile: boolean;
  /** 그림 카드에 표시할 작성자 이름 */
  authorName: string;
  feedCount: number;
  albums: UserProfileResponse["albums"];
  /** 그림 정리 모드 여부. 켜지면 이 섹션이 화면 전체를 차지한다 */
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onEditAlbums: () => void;
}
