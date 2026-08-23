export interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  /** 다운로드 버튼 노출 여부. 본인 그림일 때만 true로 넘긴다. */
  canDownload?: boolean;
}
