import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PercentCrop } from "react-image-crop";
import clsx from "clsx";
import "react-image-crop/dist/ReactCrop.css";

import Modal from "@/components/common/PopUp/Modal/Modal";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import IconComponent from "@/components/Asset/Icon";

import type { ImageCropModalProps } from "./ImageCropModal.types";
import { getCroppedBlob } from "./getCroppedBlob";

import styles from "./ImageCropModal.module.scss";

const ReactCrop = dynamic(() => import("react-image-crop"), { ssr: false });

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.1;

/**
 * 커버·프로필 이미지 수정 모달(PopUp/Modal)의 공통 뼈대.
 * 자르기 영역과 확대 슬라이더를 보여주고, 저장하면 잘라낸 이미지를 onSave로 넘긴다.
 */
export default function ImageCropModal({
  title,
  saveLabel,
  initialFile,
  currentImageSrc,
  aspect,
  output,
  variant,
  validateFile,
  onSave,
  onDelete,
  onClose,
}: ImageCropModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(initialFile);
  const [imageSrc, setImageSrc] = useState<string>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PercentCrop>();
  const [scale, setScale] = useState(MIN_SCALE);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!file) {
      setImageSrc(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(MIN_SCALE);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked || (validateFile && !validateFile(picked))) return;
    setFile(picked);
  };

  const handleDelete = async () => {
    if (!onDelete || isSaving) return;
    setIsSaving(true);
    try {
      await onDelete();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // 이미지가 로드되면 비율에 맞는 가장 큰 영역을 기본 선택으로 잡는다
  const handleImageLoad = (img: HTMLImageElement) => {
    const imageAspect = img.width / img.height;
    const initialCrop: PercentCrop =
      imageAspect >= aspect
        ? { unit: "%", height: 100, width: ((img.height * aspect) / img.width) * 100, x: 0, y: 0 }
        : { unit: "%", width: 100, height: (img.width / aspect / img.height) * 100, x: 0, y: 0 };

    const centered = {
      ...initialCrop,
      x: (100 - initialCrop.width) / 2,
      y: (100 - initialCrop.height) / 2,
    };
    setCrop(centered);
    setCompletedCrop(centered);
  };

  const handleSave = async () => {
    if (!file || !completedCrop || !imgRef.current || isSaving) return;

    setIsSaving(true);
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop, scale, output);
      await onSave(blob, file);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      className={styles.wideModal}
      buttonType="primary"
      primaryLabel={saveLabel}
      onPrimary={handleSave}
      primaryDisabled={!file || !completedCrop || isSaving}
    >
      <div className={styles.body}>
        <div className={clsx(styles.cropArea, styles[variant])}>
          {imageSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(_, percentCrop) => setCompletedCrop(percentCrop)}
              aspect={aspect}
              keepSelection
            >
              {/* ReactCrop은 원본 img 요소가 필요해 next/image를 쓸 수 없다 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="수정할 이미지"
                className={styles.image}
                style={{ transform: `scale(${scale})` }}
                onLoad={(e) => handleImageLoad(e.currentTarget)}
                draggable={false}
              />
            </ReactCrop>
          ) : (
            currentImageSrc && (
              <ResponsiveImage src={currentImageSrc} alt="현재 이미지" className={styles.image} />
            )
          )}
        </div>
        <div className={styles.zoom}>
          <IconComponent name="zoomOut" size={24} />
          <input
            type="range"
            className={styles.range}
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={SCALE_STEP}
            value={scale}
            disabled={!file}
            onChange={(e) => setScale(Number(e.target.value))}
            aria-label="확대·축소"
          />
          <IconComponent name="zoomIn" size={24} />
        </div>
        <div className={styles.actions}>
          <OutlinedButton size="regular" onClick={() => inputRef.current?.click()}>
            {file ? "다른 이미지 선택" : "이미지 선택"}
          </OutlinedButton>
          {onDelete && currentImageSrc && (
            <TextButton variant="assistive" size="regular" onClick={handleDelete} disabled={isSaving}>
              삭제
            </TextButton>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePickFile}
          />
        </div>
      </div>
    </Modal>
  );
}
