export interface CropOutputSize {
  width: number;
  height: number;
}

export interface ImageCropModalProps {
  title: string;
  saveLabel: string;
  /** 모달을 열 때 이미 고른 파일. 없으면 현재 이미지를 보여주고 모달 안에서 고르게 한다 */
  initialFile?: File;
  /** 지금 적용된 이미지(파일을 고르기 전 미리보기) */
  currentImageSrc?: string;
  /** 자르기 영역 가로/세로 비율 */
  aspect: number;
  /** 저장할 이미지 크기(px) */
  output: CropOutputSize;
  /** cover는 점선 영역, profile은 파란 테두리 영역 */
  variant: "cover" | "profile";
  /** false를 돌려주면 고른 파일을 쓰지 않는다 */
  validateFile?: (file: File) => boolean;
  onSave: (blob: Blob, file: File) => Promise<void>;
  /** 있으면 현재 이미지가 있을 때 삭제 버튼을 보여준다 */
  onDelete?: () => Promise<void> | void;
  onClose: () => void;
}
