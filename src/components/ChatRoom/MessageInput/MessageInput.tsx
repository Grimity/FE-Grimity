import { useLayoutEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import Icon from "@/components/Asset/IconTemp";
import LazyImage from "@/components/LazyImage/LazyImage";

import styles from "./MessageInput.module.scss";

interface MessageInputProps {
  message: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  images: { fileName: string; fullUrl: string }[];
  disabled?: boolean;
  onMessageChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onImagesChange: (images: { fileName: string; fullUrl: string }[]) => void;
}

const MAX_TEXTAREA_HEIGHT = 120;
const SINGLE_LINE_CONTAINER_HEIGHT = 42;
const LINE_HEIGHT_MULTIPLIER = 1.5;
const DEFAULT_LINE_HEIGHT = 20;

const MessageInput = ({
  message,
  inputRef,
  images,
  disabled,
  onMessageChange,
  onKeyPress,
  onImagesChange,
}: MessageInputProps) => {
  const adjustTextareaHeight = useCallback(() => {
    const textarea = inputRef?.current;
    if (!textarea) return;

    const container = textarea.closest(`.${styles.inputContainer}`) as HTMLElement;
    if (!container) return;

    const textareaStyle = getComputedStyle(textarea);
    const containerStyle = getComputedStyle(container);

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = parseFloat(textareaStyle.lineHeight) || DEFAULT_LINE_HEIGHT;
    const containerPadding =
      parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
    const singleLineTextareaHeight = SINGLE_LINE_CONTAINER_HEIGHT - containerPadding;

    // 한 줄과 여러 줄 구분
    if (scrollHeight <= lineHeight * LINE_HEIGHT_MULTIPLIER) {
      textarea.style.height = `${singleLineTextareaHeight}px`;
      container.style.height = `${SINGLE_LINE_CONTAINER_HEIGHT}px`;
      textarea.style.overflowY = "hidden";
    } else if (scrollHeight > MAX_TEXTAREA_HEIGHT) {
      textarea.style.height = `${MAX_TEXTAREA_HEIGHT}px`;
      container.style.height = "auto";
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = `${scrollHeight}px`;
      container.style.height = "auto";
      textarea.style.overflowY = "hidden";
    }
  }, [inputRef]);

  useLayoutEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

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
        <textarea
          ref={inputRef}
          disabled={disabled}
          className={styles.input}
          placeholder="메시지 보내기"
          value={message}
          onChange={(e) => {
            onMessageChange(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={onKeyPress}
          rows={1}
        />
      </div>
    </div>
  );
};

export default MessageInput;
