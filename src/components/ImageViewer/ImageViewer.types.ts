export interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  /** 다운로드 버튼 노출 여부. 본인 그림일 때만 true로 넘긴다. */
  canDownload?: boolean;
  /** true면 전체화면(fixed) 대신 부모(position:relative) 영역 안에서만 뜬다. PC 레이아웃에만 적용. */
  contained?: boolean;
}
