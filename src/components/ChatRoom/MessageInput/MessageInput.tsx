import { useRef, useEffect } from "react";
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

const MessageInput = ({
  message,
  inputRef,
  images,
  disabled,
  onMessageChange,
  onKeyPress,
  onImagesChange,
}: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustTextareaHeight = () => {
    const textarea = inputRef?.current || textareaRef.current;
    const container = textarea?.closest(`.${styles.inputContainer}`) as HTMLElement;
    
    if (textarea && container) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20;
      const maxHeight = 120;
      const containerPadding = parseFloat(getComputedStyle(container).paddingTop) + parseFloat(getComputedStyle(container).paddingBottom);
      const singleLineContainerHeight = 42;
      const singleLineTextareaHeight = singleLineContainerHeight - containerPadding;
      
      // 한 줄과 여러 줄 구분
      if (scrollHeight <= lineHeight * 1.5) {
        textarea.style.height = `${singleLineTextareaHeight}px`;
        container.style.height = `${singleLineContainerHeight}px`;
        textarea.style.overflowY = "hidden";
      } else if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        container.style.height = "auto";
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.height = `${scrollHeight}px`;
        container.style.height = "auto";
        textarea.style.overflowY = "hidden";
      }
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

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
          ref={(el) => {
            if (inputRef) {
              inputRef.current = el;
            }
            textareaRef.current = el;
          }}
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
