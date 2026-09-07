export type ImgSize = "lg" | "md";

export interface ImgProps {
  size?: ImgSize;
  imageUrl?: string;
  title: string;
  isRepresentative?: boolean;
  onRepresentativeClick?: () => void;
  onDeleteClick?: () => void;
  className?: string;
  /** 로컬 blob/미리보기 URL을 CDN 변환 없이 그대로 렌더링할 때 사용 (업로드 미리보기용) */
  unoptimized?: boolean;
  /** 이미지 맞춤 방식 (기본 cover). 업로드 미리보기처럼 전체가 보여야 하면 contain */
  objectFit?: "cover" | "contain";
}
