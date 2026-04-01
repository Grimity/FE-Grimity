export type ThumbnailRatio =
  | "1/1"
  | "5/4"
  | "4/3"
  | "3/2"
  | "16/10"
  | "16/9"
  | "2/1"
  | "21/9"
  | "4/1"
  | "3/4";

export interface ThumbnailProps {
  src?: string;
  alt: string;
  ratio?: ThumbnailRatio;
  className?: string;
}
