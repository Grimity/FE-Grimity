import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import LazyImage from "@/components/LazyImage/LazyImage";

import { useImageUploader } from "@/hooks/useImageUploader";
import { useToast } from "@/hooks/useToast";

import styles from "./MessageInput.module.scss";

interface MessageInputProps {
  message: string;
  isSending: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  images: { fileName: string; fullUrl: string }[];
  onImagesChange: (images: { fileName: string; fullUrl: string }[]) => void;
}

const MessageInput = ({
  message,
  isSending,
  inputRef,
  onMessageChange,
  onSend,
  onKeyPress,
  images,
  onImagesChange,
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { uploadImages } = useImageUploader({ uploadType: "chat" });

  const handleClickFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const fileArray = Array.from(files);
    const remainingSlots = 5 - images.length;

    if (fileArray.length > remainingSlots) {
      showToast("최대 5장까지 업로드할 수 있어요.", "error");
      return;
    }

    try {
      const uploadedUrls = await uploadImages(fileArray);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.inputContainer}>
      {images.length > 0 && (
        <div className={styles.imageListContainer}>
          <Swiper slidesPerView="auto" spaceBetween={10} freeMode modules={[FreeMode]}>
            {images.map((image, index) => (
              <SwiperSlide key={index} className={styles.imageWrapper}>
                <LazyImage
                  className={styles.image}
                  src={image.fullUrl}
                  alt={image.fileName}
                  width={90}
                  height={90}
                />

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveImage(index)}
                  aria-label={`이미지 ${index + 1} 삭제`}
                >
                  <Icon icon="close" size="xs" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className={styles.inputWrapper}>
        <button type="button" className={styles.cameraButton} onClick={handleClickFile}>
          <Icon icon="camera_alt" size="2.5xl" />
          <input
            ref={fileInputRef}
            multiple
            hidden
            type="file"
            accept="image/*"
            max={10}
            className={styles.fileInput}
            onChange={handleImageUpload}
          />
        </button>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="메시지 보내기"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyPress}
        />
        {(message.trim() || images.length > 0) && (
          <Button
            type="filled-primary"
            size="m"
            className={styles.sendButton}
            onClick={onSend}
            onMouseDown={(e) => e.preventDefault()}
            disabled={isSending}
          >
            전송
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;