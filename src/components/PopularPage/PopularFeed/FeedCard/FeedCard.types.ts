export interface FeedCardProps {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  isLike?: boolean;
  author: {
    id: string;
    name: string;
    image: string;
    url: string;
  };
}
