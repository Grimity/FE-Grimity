import ImageCropModal from "../ImageCrop/ImageCropModal";

// 프로필 이미지는 정사각형으로 잘라 저장한다
const PROFILE_ASPECT = 1;
const PROFILE_OUTPUT = { width: 640, height: 640 };

interface ProfileImageModalProps {
  initialFile?: File;
  /** 지금 적용된 프로필 이미지(기본 이미지면 undefined) */
  currentImageSrc?: string;
  /** 저장에 성공하면 true를 돌려준다. 성공했을 때만 모달을 닫는다 */
  onSave: (blob: Blob, file: File) => Promise<boolean>;
  validateFile?: (file: File) => boolean;
  onDelete?: () => Promise<void> | void;
  onClose: () => void;
}

export default function ProfileImageModal({
  initialFile,
  currentImageSrc,
  onSave,
  validateFile,
  onDelete,
  onClose,
}: ProfileImageModalProps) {
  const handleSave = async (blob: Blob, file: File) => {
    const isSaved = await onSave(blob, file);
    if (isSaved) onClose();
  };

  return (
    <ImageCropModal
      title="프로필 이미지 수정"
      saveLabel="프로필 저장"
      initialFile={initialFile}
      currentImageSrc={currentImageSrc}
      validateFile={validateFile}
      onDelete={onDelete}
      aspect={PROFILE_ASPECT}
      output={PROFILE_OUTPUT}
      variant="profile"
      onSave={handleSave}
      onClose={onClose}
    />
  );
}
