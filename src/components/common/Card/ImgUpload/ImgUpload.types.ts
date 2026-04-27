export type ImgUploadSize = "lg" | "md";

export interface ImgUploadProps {
  size?: ImgUploadSize;
  onClick?: () => void;
  className?: string;
}
