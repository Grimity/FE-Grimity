import { useCallback, useEffect, useRef, useState } from "react";
import router from "next/router";
import clsx from "clsx";

import { postPresignedUrls, PresignedUrlRequest } from "@/api/images/postPresigned";

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

import Icon from "@/components/common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import TextField from "@/components/common/Input/TextField/TextField";
import TextArea from "@/components/common/Input/TextArea/TextArea";
import TagSelect from "@/components/common/Tag/TagSelect/TagSelect";
import ImgUpload from "@/components/common/Card/ImgUpload/ImgUpload";
import Alert from "@/components/common/PopUp/Alert/Alert";
import DraggableImage from "@/components/Upload/DraggableImage/DraggableImage";
import AlbumSelectModal from "@/components/Modal/AlbumSelect/AlbumSelectModal";

import { useModal } from "@/hooks/useModal";
import { useDeviceStore } from "@/states/deviceStore";
import { useUploadHeaderStore } from "@/states/uploadHeaderStore";

import { CreateFeedRequest } from "@/api/feeds/postFeeds";

import { FeedFormProps } from "@/components/Upload/FeedForm/FeedForm.types";

import { useToast } from "@/hooks/useToast";

import { removeUrlPrefix } from "@/utils/removeUrlPrefix";
import { getImageDimensions } from "@/utils/getImageDimensions";
import { convertToWebP } from "@/utils/convertToWebP";

import styles from "@/components/Upload/FeedForm/FeedForm.module.scss";

const MAX_IMAGES = 10;
const MAX_TAGS = 10;
const UPLOAD_DESCRIPTION = ["JPG/PNG", "1장 당 10MB 이내", "최대 10장까지 업로드"];

export default function FeedForm({
  isEditMode,
  initialValues,
  onSubmit,
  onStateUpdate,
}: FeedFormProps) {
  const [images, setImages] = useState<{ name: string; originalName: string; url: string }[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedAlbumName, setSelectedAlbumName] = useState("");

  const { openModal: openDsModal } = useModal();
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();

  const cardSize = isMobile ? "md" : "lg";

  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        if (img.url.startsWith("blob:")) URL.revokeObjectURL(img.url);
      });
    };
  }, []);

  const resetUnsavedChanges = () => {
    hasUnsavedChangesRef.current = false;
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    onStateUpdate?.({ resetUnsavedChanges });
  }, [onStateUpdate]);

  const handleOpenAlbumSelect = () => {
    openDsModal(
      (close) => (
        <AlbumSelectModal
          close={close}
          selectedAlbumId={selectedAlbumId}
          onSelect={(id, name) => {
            setSelectedAlbumId(id);
            setSelectedAlbumName(id ? name : "전체 앨범");
          }}
        />
      ),
      undefined,
      { bare: true },
    );
  };

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setContent(initialValues.content || "");
      setTags(initialValues.tags || []);
      setImages(initialValues.images || []);
      setThumbnailUrl(initialValues.thumbnailUrl || "");
      setThumbnailName(initialValues.thumbnailName || "");
      setSelectedAlbumId(initialValues.albumId || null);
      setSelectedAlbumName(initialValues.albumName || "");
    }
  }, [initialValues]);

  useEffect(() => {
    if (images.length === 0) {
      if (thumbnailUrl) {
        setThumbnailUrl("");
        setThumbnailName("");
      }
      return;
    }
    const stillExists = images.some((img) => img.url === thumbnailUrl);
    if (!stillExists) {
      setThumbnailUrl(images[0].url);
      setThumbnailName(images[0].name);
    }
  }, [images, thumbnailUrl]);

  // 변경 사항 감지
  useEffect(() => {
    if (isEditMode && initialValues) {
      setHasUnsavedChanges(
        title !== (initialValues.title || "") ||
          content !== (initialValues.content || "") ||
          thumbnailName !== (initialValues.thumbnailName || "") ||
          JSON.stringify(tags) !== JSON.stringify(initialValues.tags || []) ||
          JSON.stringify(images.map((img) => removeUrlPrefix(img.name))) !==
            JSON.stringify((initialValues.images || []).map((img) => removeUrlPrefix(img.name))) ||
          selectedAlbumId !== (initialValues.albumId || null),
      );
    } else {
      setHasUnsavedChanges(
        images.length > 0 || title.trim() !== "" || content.trim() !== "" || tags.length > 0,
      );
    }
  }, [images, title, content, tags, thumbnailName, selectedAlbumId, initialValues, isEditMode]);

  // 브라우저 이벤트 핸들러
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = "변경사항이 저장되지 않을 수 있습니다.";
        e.preventDefault();
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!hasUnsavedChangesRef.current) return;

      router.events.emit("routeChangeError");

      openDsModal((close) => (
        <Alert
          variant="content"
          title="업로드를 취소하고 나가시겠어요?"
          size="xl"
          contentText="작성한 내용들은 모두 초기화돼요"
          secondaryLabel="아니요"
          onSecondary={close}
          primaryLabel="나가기"
          onPrimary={() => {
            hasUnsavedChangesRef.current = false;
            setHasUnsavedChanges(false);
            close();
            router.push(url);
          }}
        />
      ));

      throw "routeChange aborted.";
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [openDsModal]);

  const getFileExtension = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "webp") {
      return ext;
    }
    return null;
  };

  const processFile = async (file: File): Promise<File | null> => {
    const ext = getFileExtension(file.name);

    if (!ext) {
      showToast("지원되지 않는 파일 형식입니다. (jpg, png, jpeg, webp만 가능)", "error");
      return null;
    }

    if (ext === "png" || ext === "jpg" || ext === "jpeg") {
      return await convertToWebP(file);
    }

    return file;
  };

  const uploadImagesToServer = async (files: FileList) => {
    try {
      const remainingSlots = MAX_IMAGES - images.length;
      if (remainingSlots <= 0) {
        showToast("최대 10장의 그림만 업로드할 수 있습니다.", "error");
        return;
      }

      const filesToUpload = Array.from(files)
        .slice(0, remainingSlots)
        .filter((file) => file.type.startsWith("image/"));

      const processedFiles = (await Promise.all(filesToUpload.map(processFile))).filter(
        Boolean,
      ) as File[];

      if (processedFiles.length === 0) return;

      const requests: PresignedUrlRequest[] = await Promise.all(
        processedFiles.map(async (file) => {
          const { width, height } = await getImageDimensions(file);
          return {
            type: "feed",
            ext: "webp",
            width,
            height,
          };
        }),
      );

      if (requests.length === 0) return;

      const presignedUrls = await postPresignedUrls(requests);

      const uploadPromises = processedFiles.map((file, index) =>
        fetch(presignedUrls[index].uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        }),
      );

      await Promise.all(uploadPromises);

      const newImages = processedFiles.map((file, index) => ({
        name: presignedUrls[index].imageName,
        originalName: file.name,
        url: URL.createObjectURL(file),
      }));

      setImages((prev) => [...prev, ...newImages]);
    } catch {
      showToast("이미지 업로드를 실패했어요.", "error");
    }
  };

  const selectThumbnail = (url: string) => {
    setThumbnailUrl(url);
    const selectedImage = images.find((img) => img.url === url);
    if (selectedImage) {
      setThumbnailName(selectedImage.name);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    setImages((prevImages) => {
      const newImages = [...prevImages];
      const draggedImage = newImages[sourceIndex];
      newImages.splice(sourceIndex, 1);
      newImages.splice(destinationIndex, 0, draggedImage);
      return newImages;
    });
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    await uploadImagesToServer(files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (index: number) => {
    const removed = images[index];
    if (removed?.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      showToast("제목을 입력해주세요.", "error");
      return;
    }

    if (!content.trim()) {
      showToast("내용을 입력해주세요.", "error");
      return;
    }

    if (content.length > 500) {
      showToast("내용은 최대 500자까지 입력할 수 있습니다.", "error");
      return;
    }

    if (images.length === 0) {
      showToast("최소 1장의 그림을 업로드해야 합니다.", "error");
      return;
    }

    const data: CreateFeedRequest = {
      title,
      cards: images.map((image) => removeUrlPrefix(image.name)),
      content,
      tags,
      thumbnail: removeUrlPrefix(thumbnailName),
      albumId: selectedAlbumId && selectedAlbumId.trim() !== "" ? selectedAlbumId : null,
    };

    onSubmit(data);
  }, [title, content, images, tags, thumbnailName, selectedAlbumId, onSubmit, showToast]);

  const handleAddTag = (rawTag: string) => {
    const newTag = rawTag.replace(/#/g, "").trim();

    if (newTag.length < 2) {
      showToast("태그는 두 글자 이상이어야 합니다.", "error");
      return;
    }

    if (tags.length >= MAX_TAGS) {
      showToast("태그는 최대 10개까지 추가할 수 있어요", "error");
      return;
    }

    if (tags.includes(newTag)) {
      showToast("이미 추가된 태그입니다.", "error");
      return;
    }

    setTags((prevTags) => [...prevTags, newTag]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isScrollable = container.scrollWidth > container.clientWidth;

    if (!isScrollable) return;

    e.preventDefault();
    container.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  const isDisabled = title.trim() === "" || content.trim() === "" || images.length === 0;

  const buttonText = isEditMode ? "수정" : "업로드";

  useEffect(() => {
    if (!isMobile) {
      useUploadHeaderStore.getState().clear();
      return;
    }
    useUploadHeaderStore
      .getState()
      .setHeader({ label: buttonText, disabled: isDisabled, submit: handleSubmit });
    return () => useUploadHeaderStore.getState().clear();
  }, [isMobile, isDisabled, buttonText, handleSubmit]);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClickFileInput = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

  return (
    <div className={styles.background}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg, image/webp"
        hidden
        onClick={handleClickFileInput}
        onChange={(e) => e.target.files && uploadImagesToServer(e.target.files)}
      />
      <div className={styles.container}>
        {!isMobile && (
          <h1 className={styles.pageTitle}>{isEditMode ? "그림 수정" : "그림 업로드"}</h1>
        )}

        <section className={styles.imageSection} onDrop={handleDrop} onDragOver={handleDragOver}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              className={clsx(styles.imageRow, images.length === 0 && styles.imageRowEmpty)}
              ref={containerRef}
            >
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <div
                    className={styles.imageTrack}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {images.map((image, index) => (
                      <DraggableImage
                        key={image.name}
                        image={image}
                        index={index}
                        name={image.originalName}
                        size={cardSize}
                        removeImage={() => removeImage(index)}
                        isThumbnail={thumbnailUrl === image.url}
                        onThumbnailSelect={() => selectThumbnail(image.url)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {images.length < MAX_IMAGES && (
                <ImgUpload
                  size={cardSize}
                  className={styles.uploadCard}
                  description={UPLOAD_DESCRIPTION}
                  onClick={handleImageUpload}
                />
              )}
            </div>
          </DragDropContext>
        </section>

        <section className={styles.writeSection}>
          <TextField
            variant="title"
            size={isMobile ? "sm" : "md"}
            maxCount={32}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextArea
            variant="underline"
            maxCount={500}
            placeholder="내용을 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.contentArea}
          />

          <div className={styles.field}>
            <label className={styles.label}>태그</label>
            <TagSelect
              className={styles.tagSelect}
              tags={tags}
              onAddTag={handleAddTag}
              onRemoveTag={removeTag}
              maxTags={MAX_TAGS}
              placeholder="태그 추가"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>앨범</label>
            <TextButton
              variant="assistive"
              className={styles.albumButton}
              iconRight={<Icon name="chevron-right" size={16} color="gray-normal" />}
              onClick={handleOpenAlbumSelect}
            >
              {selectedAlbumName?.trim() || "전체 앨범"}
            </TextButton>
          </div>
        </section>

        {!isMobile && (
          <div className={styles.submitRow}>
            <SolidButton
              size="large"
              className={styles.submitButton}
              disabled={isDisabled}
              onClick={handleSubmit}
            >
              {buttonText}
            </SolidButton>
          </div>
        )}
      </div>
    </div>
  );
}
