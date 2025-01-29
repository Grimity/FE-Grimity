import { Draggable } from "react-beautiful-dnd";
import { DraggableImageProps } from "./DraggableImage.types";
import Image from "next/image";
import styles from "./DraggableImage.module.scss";
import { useState } from "react";

export default function DraggableImage({
  image,
  index,
  removeImage,
  isThumbnail,
  onThumbnailSelect,
}: DraggableImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Draggable draggableId={image.name} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={styles.imageWrapper}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} scale(1.05)`
              : provided.draggableProps.style?.transform,
          }}
        >
          {isLoading && (
            <div className={styles.loading}>
              <p className={styles.loadingMsg}>이미지를 업로드 중이에요</p>
              <span className={styles.loader}></span>
            </div>
          )}
          <div className={`${styles.imageContainer} ${isLoading ? styles.hidden : ""}`}>
            <div className={styles.moveImage} {...provided.dragHandleProps}>
              <Image
                src="/icon/upload-move-image.svg"
                width={40}
                height={40}
                alt="사진 순서 변경"
              />
            </div>
            <div className={styles.thumbnail} onClick={onThumbnailSelect}>
              <Image
                src={isThumbnail ? "/icon/thumbnail-on.svg" : "/icon/thumbnail-off.svg"}
                width={67}
                height={32}
                alt="사진 썸네일 지정"
              />
            </div>
            <Image
              src={image.url}
              width={320}
              height={240}
              layout="intrinsic"
              alt="Uploaded"
              className={styles.image}
              onLoad={handleImageLoad}
            />
            <div className={styles.removeImage} onClick={() => removeImage(index)}>
              <Image src="/icon/upload-delete-image.svg" width={40} height={40} alt="사진 제거" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
