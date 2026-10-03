import { Draggable } from "@hello-pangea/dnd";

import Img from "@/components/common/Card/Img/Img";

import { DraggableImageProps } from "./DraggableImage.types";
import styles from "./DraggableImage.module.scss";

export default function DraggableImage({
  image,
  index,
  name,
  size = "lg",
  removeImage,
  isThumbnail,
  onThumbnailSelect,
}: DraggableImageProps) {
  return (
    <Draggable draggableId={image.name} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.imageWrapper}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} scale(1.05)`
              : provided.draggableProps.style?.transform,
          }}
        >
          <Img
            size={size}
            imageUrl={image.url}
            title={name}
            unoptimized
            objectFit="contain"
            isRepresentative={isThumbnail}
            onRepresentativeClick={onThumbnailSelect}
            onDeleteClick={() => removeImage(index)}
          />
        </div>
      )}
    </Draggable>
  );
}
