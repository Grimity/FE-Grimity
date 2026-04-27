export type ImgSize = "lg" | "md";

export interface ImgProps {
  size?: ImgSize;
  imageUrl?: string;
  title: string;
  isRepresentative?: boolean;
  onRepresentativeClick?: () => void;
  onDeleteClick?: () => void;
  className?: string;
}
