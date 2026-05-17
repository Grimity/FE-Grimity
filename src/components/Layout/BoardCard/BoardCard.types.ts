export interface BoardCardProps {
  id: string;
  title: string;
  commentCount: number;
  viewCount: number;
  createdAt: string | Date;
  thumbnail?: string | null;
  content?: string | null;
  isNotice?: boolean;
}
