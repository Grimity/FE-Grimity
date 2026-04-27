import { useCallback, useEffect, useRef, useState } from "react";
import router from "next/router";

import { postPresignedUrls, PresignedUrlRequest } from "@/api/images/postPresigned";

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import DraggableImage from "@/components/Upload/DraggableImage/DraggableImage";
import Chip from "@/components/Chip/Chip";

import { useModalStore } from "@/states/modalStore";

import { CreateFeedRequest } from "@/api/feeds/postFeeds";

import { FeedFormProps } from "@/components/Upload/FeedForm/FeedForm.types";

import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";

import { removeUrlPrefix } from "@/utils/removeUrlPrefix";
import { getImageDimensions } from "@/utils/getImageDimensions";

import styles from "@/components/Upload/FeedForm/FeedForm.module.scss";

export default function FeedForm({
  isEditMode,
  initialValues,
  onSubmit,
  onStateUpdate,
}: FeedFormProps) {
  const [images, setImages] = useState<{ name: string; originalName: string; url: string }[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedAlbumName, setSelectedAlbumName] = useState("");

  const openModal = useModalStore((state) => state.openModal);
  const { showToast } = useToast();

  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isMobile, isTablet } = useDeviceStore();

  const resetUnsavedChanges = () => {
    hasUnsavedChangesRef.current = false;
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    onStateUpdate?.({ resetUnsavedChanges });
  }, [onStateUpdate]);

  const handleOpenAlbumSelect = () => {
    const data = {
      hideCloseButton: true,
      selectedAlbumId: selectedAlbumId,
      onSelect: (id: string, name: string) => {
        setSelectedAlbumId(id);
        setSelectedAlbumName(id ? name : "");
      },
    };

    openModal({
      type: "ALBUM-SELECT",
      data: {
        ...data,
        ...(isMobile ? { title: "앨범 선택" } : {}),
      },
      ...(isMobile && { isFill: true }),
    });
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

  // 첫 번째 사진을 썸네일 기본값으로
  useEffect(() => {
    if (images.length > 0 && !thumbnailUrl) {
      setThumbnailUrl(images[0].url);
      setThumbnailName(images[0].name);
    } else if (images.length === 0) {
      setThumbnailUrl("");
      setThumbnailName("");
    }
  }, [images, thumbnailUrl]);

  // 변경 사항 감지
  useEffect(() => {
    const checkUnsavedChanges = () => {
      if (isEditMode && initialValues) {
        const hasChanges =
          title !== (initialValues.title || "") ||
          content !== (initialValues.content || "") ||
          thumbnailName !== (initialValues.thumbnailName || "") ||
          JSON.stringify(tags) !== JSON.stringify(initialValues.tags || []) ||
          JSON.stringify(images.map((img) => removeUrlPrefix(img.name))) !==
            JSON.stringify((initialValues.images || []).map((img) => removeUrlPrefix(img.name))) ||
          selectedAlbumId !== (initialValues.albumId || null);
        setHasUnsavedChanges(hasChanges);
      } else {
        const hasChanges =
          images.length > 0 || title.trim() !== "" || content.trim() !== "" || tags.length > 0;
        setHasUnsavedChanges(hasChanges);
      }
    };
    checkUnsavedChanges();
  }, [images, title, content, tags, thumbnailUrl, selectedAlbumId, initialValues, isEditMode]);

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

  // // 라우터 이벤트 핸들러
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!hasUnsavedChangesRef.current) return;

      router.events.emit("routeChangeError");

      openModal({
        type: null,
        data: {
          title: `업로드를 취소하고 나가시겠어요?`,
          subtitle: "작성한 내용들은 모두 초기화돼요",
          confirmBtn: "나가기",
          onClick: () => {
            hasUnsavedChangesRef.current = false;
            setHasUnsavedChanges(false);
            router.push(url);
          },
        },
        isComfirm: true,
      });

      throw "routeChange aborted.";
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router, openModal]);

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            console.error("Canvas context가 존재하지 않음");
            reject(new Error("Canvas context not found"));
            return;
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error("WebP 변환 실패");
                reject(new Error("WebP 변환 실패"));
                return;
              }
              const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                type: "image/webp",
              });
              resolve(webpFile);
            },
            "image/webp",
            0.9,
          );
        };
        img.onerror = (error) => {
          console.error("이미지 로드 실패", error);
          reject(error);
        };
      };
      reader.onerror = (error) => {
        console.error("FileReader 실패", error);
        reject(error);
      };
    });
  };

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
      const remainingSlots = 10 - images.length;
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

      setImages([...images, ...newImages]);
    } catch (error) {
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

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      return newImages;
    });
  }, []);

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
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      const isThumbnailRemoved = thumbnailUrl === prevImages[index].url;

      if (isThumbnailRemoved && updatedImages.length > 0) {
        setThumbnailUrl(updatedImages[0].url);
        setThumbnailName(updatedImages[0].name);
      } else if (updatedImages.length === 0) {
        setThumbnailUrl("");
        setThumbnailName("");
      }

      return updatedImages;
    });
  };

  const handleSubmit = () => {
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
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && tag.trim() !== "") {
      event.preventDefault();

      if (tag.trim().length < 2) {
        showToast("태그는 두 글자 이상이어야 합니다.", "error");
        return;
      }

      if (tags.length >= 10) {
        showToast("태그는 최대 10개까지 추가할 수 있어요", "error");
        return;
      }

      const newTag = tag.replace(/#/g, "").trim();

      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      } else {
        showToast("이미 추가된 태그입니다.", "error");
      }

      setTag("");
    }
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
    if (!containerRef.current) return;

    containerRef.current.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  const isDisabled = title.trim() === "" || content.trim() === "" || images.length === 0;

  const buttonText = () => {
    return isEditMode ? "수정" : "업로드";
  };

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
        <div className={styles.sectionContainer}>
          <section className={styles.imageSection} onDrop={handleDrop} onDragOver={handleDragOver}>
            <div className={`${styles.addBtnContainer} ${!images.length ? styles.empty : ""}`}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided) => (
                    <div
                      className={styles.imageContainer}
                      ref={(el) => {
                        provided.innerRef(el);
                        containerRef.current = el;
                      }}
                      {...provided.droppableProps}
                    >
                      {images.map((image, index) => (
                        <DraggableImage
                          key={image.name}
                          image={image}
                          index={index}
                          name={image.originalName}
                          moveImage={moveImage}
                          removeImage={() => removeImage(index)}
                          isThumbnail={thumbnailUrl === image.url}
                          onThumbnailSelect={() => selectThumbnail(image.url)}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {((!isMobile && !isTablet) || images.length === 0) && images.length < 10 && (
                <div role="button" onClick={handleImageUpload} className={styles.uploadBtn}>
                  <div tabIndex={0}>
                    <img
                      src="/image/upload.svg"
                      width={240}
                      height={240}
                      alt="그림 추가"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {(isMobile || isTablet) && images.length > 0 && images.length < 10 && (
            <div role="button" onClick={handleImageUpload} style={{ width: "100%" }}>
              <div className={styles.imageAddBtn}>
                <IconComponent name="mobileAddImage" size={16} />
                이미지 추가
              </div>
            </div>
          )}
          <section className={styles.writeSection}>
            <div className={styles.textField}>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={32}
                />
                {title && (
                  <div className={styles.countTotal}>
                    <p className={styles.count}>{title.length}</p>/{32}
                  </div>
                )}
              </div>
              <div className={styles.bar} />
              <div className={styles.contentContainer}>
                <div className={styles.textareaContainer}>
                  <textarea
                    className={styles.textarea}
                    placeholder="내용을 입력해주세요."
                    value={content}
                    maxLength={500}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  {content && (
                    <div className={styles.contentCount}>
                      <div className={styles.countTotal}>
                        <p className={styles.count}>{content.length}</p>/{500}
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.bar} />
              </div>
              <div className={styles.tagContainer}>
                <div className={styles.tagInputContainer}>
                  <label className={styles.label}>태그</label>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="엔터를 통해 10개까지 입력할 수 있어요"
                      maxLength={10}
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      enterKeyHint="done"
                      autoComplete="off"
                    />
                    {tag && (
                      <div className={styles.countTotal}>
                        <p className={styles.count}>{tag.length}</p>/{10}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.tagList}>
                  {tags.map((tag, index) => (
                    <Chip
                      size="m"
                      type="filled-assistive"
                      key={index}
                      rightIcon={
                        <div
                          onClick={() => removeTag(index)}
                          role="button"
                          tabIndex={0}
                          className={styles.deleteTag}
                        >
                          <IconComponent name="deleteTag" size={16} isBtn />
                        </div>
                      }
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className={styles.tagContainer}>
                <div className={styles.tagInputContainer}>
                  <label className={styles.label}>앨범</label>
                  <div className={styles.inputContainer}>
                    <div
                      className={`${
                        selectedAlbumName?.trim() ? styles.textSelected : styles.text
                      } ${styles.albumClick}`}
                      onClick={handleOpenAlbumSelect}
                      role="button"
                      tabIndex={0}
                    >
                      {selectedAlbumName?.trim() || "앨범 선택"}
                    </div>
                    <div
                      className={styles.albumClick}
                      onClick={handleOpenAlbumSelect}
                      role="button"
                      tabIndex={0}
                    >
                      <IconComponent name="openAlbumSelect" size={14} isBtn />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {isMobile ? (
            <Button size="l" type="filled-primary" disabled={isDisabled} onClick={handleSubmit}>
              {buttonText()}
            </Button>
          ) : (
            <div className={styles.uploadBtn}>
              <Button
                size="l"
                type="filled-primary"
                disabled={isDisabled}
                onClick={handleSubmit}
                width="200px"
              >
                {buttonText()}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
