export interface DraggableImageProps {
  image: { name: string; url: string };
  index: number;
  name: string;
  size?: "lg" | "md";
  removeImage: (index: number) => void;
  isThumbnail: boolean;
  onThumbnailSelect: () => void;
}
