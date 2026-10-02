export interface CropOutputSize {
  width: number;
  height: number;
}

export interface ImageCropModalProps {
  title: string;
  saveLabel: string;
  imageSrc: string;
  /** 자르기 영역 가로/세로 비율 */
  aspect: number;
  /** 저장할 이미지 크기(px) */
  output: CropOutputSize;
  /** cover는 점선 영역, profile은 파란 테두리 영역 */
  variant: "cover" | "profile";
  onSave: (blob: Blob) => Promise<void>;
  onClose: () => void;
}
