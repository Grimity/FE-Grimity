export interface PostsSectionProps {
  userId: string;
  isMyProfile: boolean;
  authorName: string;
  /** 전체 글 수. 페이지 수 계산에 쓰인다 */
  postCount: number;
}
