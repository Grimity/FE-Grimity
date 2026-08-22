import { useState } from "react";
import { useRouter } from "next/router";

import { ModalState, ModalType, useModalStore } from "@/states/modalStore";
import { useAlbumUpdateOne } from "@/api/generated/albums/albums";

import { useDeviceStore } from "@/states/deviceStore";
import { useToast } from "@/hooks/useToast";

import Album from "@/components/common/Card/Album/Album";
import Icon from "@/components/common/Icon/Icon";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import Empty from "@/components/common/Empty/Empty";
import PopUpModal from "@/components/common/PopUp/Modal/Modal";
import Input from "@/components/common/Input/Input/Input";

import styles from "@/components/ProfilePage/FeedAlbumEditor/FeedAlbumEditor.module.scss";

interface Feed {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string | Date;
  albumId?: string;
}

interface Album {
  id: string;
  name: string;
  feedCount: number;
}

interface FeedAlbumEditorProps {
  feeds: Feed[];
  albums: Album[];
  activeAlbum: string | null;
  onExitEditMode?: () => void;
}

export default function FeedAlbumEditor({
  feeds,
  albums,
  activeAlbum,
  onExitEditMode,
}: FeedAlbumEditorProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const openModal = useModalStore((state) => state.openModal);
  const { isMobile } = useDeviceStore();
  const { showToast } = useToast();
  const router = useRouter();
  const currentAlbum = activeAlbum ? albums.find((album) => album.id === activeAlbum) : null;
  const displayName = currentAlbum ? currentAlbum.name : "전체";
  const displayCount = feeds.length;

  const { mutateAsync: updateAlbum, isPending: isRenamePending } = useAlbumUpdateOne();

  const handleCardSelect = (feedId: string) => {
    setSelectedCards((prev) =>
      prev.includes(feedId) ? prev.filter((id) => id !== feedId) : [...prev, feedId],
    );
  };

  const handleMoveAlbum = () => {
    if (selectedCards.length === 0) return;

    const modalData: Omit<ModalState, "isOpen"> = {
      type: "ALBUM-MOVE" as ModalType,
      data: {
        title: "앨범 이동",
        selectedFeedIds: selectedCards,
        currentAlbumId: activeAlbum,
        onComplete: () => {
          setSelectedCards([]);
        },
        ...(albums.length === 0 && { hideCloseButton: true }),
      },
    };

    if (isMobile) modalData.isFill = albums.length > 0;

    openModal(modalData);
  };

  const handleDeleteSelected = () => {
    if (selectedCards.length === 0) return;
    openModal({
      type: "ALBUM-DELETE",
      data: {
        hideCloseButton: true,
        selectedFeedIds: selectedCards,
        count: selectedCards.length,
        onComplete: () => {
          setSelectedCards([]);
        },
      },
    });
  };

  const handleGoBack = () => {
    if (onExitEditMode) {
      onExitEditMode();
    } else {
      router.push("/");
    }
  };

  const handleOpenRename = () => {
    if (!currentAlbum) return;
    setRenameValue(currentAlbum.name);
    setIsRenaming(true);
  };

  const handleRename = async () => {
    if (!currentAlbum) return;
    const trimmed = renameValue.trim();
    if (!trimmed) {
      showToast("앨범명은 비워둘 수 없습니다.", "error");
      return;
    }
    if (trimmed === currentAlbum.name) {
      setIsRenaming(false);
      return;
    }

    try {
      await updateAlbum({ id: currentAlbum.id, data: { name: trimmed } });
      showToast("앨범명이 변경되었습니다.", "success");
      setIsRenaming(false);
      router.reload();
    } catch {
      showToast("앨범명 변경에 실패했습니다.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.albumInfo}>
          <div className={styles.albumNameRow}>
            <h1 className={styles.albumName}>{displayName}</h1>
            {currentAlbum && (
              <TextButton
                variant="assistive"
                size="regular"
                iconLeft={<Icon name="pen" size={16} />}
                onClick={handleOpenRename}
              >
                앨범명 변경
              </TextButton>
            )}
          </div>
          <p className={styles.feedCountContainer}>
            그림 <span className={styles.feedCount}>{displayCount}</span>
          </p>
        </div>

        {feeds.length === 0 ? (
          <Empty size="xl" iconName="illust-upload-success" title="업로드한 그림이 없어요" />
        ) : (
          <div className={styles.cardGrid}>
            {feeds.map((feed) => (
              <Album
                key={feed.id}
                variant="check"
                imageUrl={feed.thumbnail}
                title={feed.title}
                nickname=""
                likeCount={feed.likeCount}
                viewCount={feed.viewCount}
                checked={selectedCards.includes(feed.id)}
                onClick={() => handleCardSelect(feed.id)}
                onCheckClick={() => handleCardSelect(feed.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.inner}>
          <TextButton
            variant="primary"
            size="regular"
            iconLeft={<Icon name="chevron-left" size={20} />}
            onClick={handleGoBack}
          >
            돌아가기
          </TextButton>
          <div className={styles.rightSection}>
            <TextButton
              variant="primary"
              size="regular"
              iconLeft={<Icon name="trash-bin-trash" size={20} />}
              onClick={handleDeleteSelected}
              disabled={selectedCards.length === 0}
            >
              {isMobile ? "삭제" : "선택 삭제"}
            </TextButton>
            <TextButton
              variant="primary"
              size="regular"
              iconLeft={<Icon name="forward-2" size={20} />}
              onClick={handleMoveAlbum}
              disabled={selectedCards.length === 0}
            >
              {isMobile ? "이동" : "앨범 이동"}
            </TextButton>
          </div>
        </div>
      </div>

      {isRenaming && (
        <PopUpModal
          title="앨범명 변경"
          onClose={() => setIsRenaming(false)}
          buttonType="double"
          secondaryLabel="닫기"
          onSecondary={() => setIsRenaming(false)}
          primaryLabel="변경하기"
          onPrimary={handleRename}
          primaryDisabled={isRenamePending}
        >
          <Input
            inputType="textfield"
            maxCount={15}
            textFieldProps={{
              value: renameValue,
              maxLength: 15,
              onChange: (e) => setRenameValue(e.target.value),
              onKeyDown: (e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRename();
                }
              },
            }}
          />
        </PopUpModal>
      )}
    </div>
  );
}
