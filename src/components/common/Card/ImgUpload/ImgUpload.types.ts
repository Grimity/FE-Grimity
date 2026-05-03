export type ImgUploadSize = "lg" | "md";

export interface ImgUploadProps {
  size?: ImgUploadSize;
  description?: string[];
  onClick?: () => void;
  className?: string;
}
