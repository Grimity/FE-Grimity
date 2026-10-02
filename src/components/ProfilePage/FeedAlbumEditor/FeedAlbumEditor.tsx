import { useState } from "react";
import { useRouter } from "next/router";

import { useAlbumUpdateOne } from "@/api/generated/albums/albums";

import { useDeviceStore } from "@/states/deviceStore";
import { useToast } from "@/hooks/useToast";

import Album from "@/components/common/Card/Album/Album";
import Icon from "@/components/common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import Empty from "@/components/common/Empty/Empty";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import AlbumMove from "@/components/Modal/AlbumMove/AlbumMove";
import AlbumDelete from "@/components/Modal/AlbumDelete/AlbumDelete";
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
  const [isMoving, setIsMoving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsMoving(true);
  };

  const handleDeleteSelected = () => {
    if (selectedCards.length === 0) return;
    setIsDeleting(true);
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

  const renameDisabled = isRenamePending || renameValue.trim().length === 0;
  const renameInput = (
    <Input
      inputType="textfield"
      textFieldProps={{
        value: renameValue,
        maxLength: 15,
        placeholder: "예시 : ‘크로키’ 또는 ‘일러스트’",
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
  );

  return (
    <div className={styles.container}>
      {isMobile && (
        <header className={styles.mobileHeader}>
          <div className={styles.mobileLeft}>
            <button
              type="button"
              className={styles.backButton}
              onClick={handleGoBack}
              aria-label="돌아가기"
            >
              <Icon name="chevron-left" size={24} />
            </button>
            <h2 className={styles.mobileTitle}>그림 정리</h2>
          </div>
          <TextButton variant="assistive" size="regular" onClick={handleGoBack}>
            저장
          </TextButton>
        </header>
      )}
      <div className={styles.center}>
        <div className={styles.albumInfo}>
          <div className={styles.albumNameRow}>
            <h1 className={styles.albumName}>{displayName}</h1>
            {currentAlbum && (
              <TextButton
                variant="assistive"
                size="regular"
                iconRight={<Icon name="pen" size={16} />}
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
          <div className={styles.emptyWrap}>
            <Empty size="xl" iconName="illust-upload-success" title="업로드한 그림이 없어요" />
          </div>
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

      {isMobile ? (
        <div className={styles.floatingActions}>
          <SolidButton
            size="large"
            iconLeft={<Icon name="trash-bin-trash" size={20} />}
            onClick={handleDeleteSelected}
            disabled={selectedCards.length === 0}
          >
            선택 삭제
          </SolidButton>
          <SolidButton
            size="large"
            iconLeft={<Icon name="forward-2" size={20} />}
            onClick={handleMoveAlbum}
            disabled={selectedCards.length === 0}
          >
            앨범 이동
          </SolidButton>
        </div>
      ) : (
        <div className={styles.footer}>
          <div className={styles.inner}>
            <TextButton
              variant="assistive"
              size="regular"
              iconLeft={<Icon name="chevron-left" size={20} />}
              onClick={handleGoBack}
            >
              돌아가기
            </TextButton>
            <div className={styles.rightSection}>
              <TextButton
                variant="assistive"
                size="regular"
                iconRight={<Icon name="trash-bin-trash" size={20} />}
                onClick={handleDeleteSelected}
                disabled={selectedCards.length === 0}
              >
                선택 삭제
              </TextButton>
              <TextButton
                variant="assistive"
                size="regular"
                iconRight={<Icon name="forward-2" size={20} />}
                onClick={handleMoveAlbum}
                disabled={selectedCards.length === 0}
              >
                앨범 이동
              </TextButton>
            </div>
          </div>
        </div>
      )}

      {isMoving && (
        <AlbumMove
          selectedFeedIds={selectedCards}
          currentAlbumId={activeAlbum}
          onClose={() => setIsMoving(false)}
          onComplete={() => setSelectedCards([])}
        />
      )}
      {isDeleting && (
        <AlbumDelete
          selectedFeedIds={selectedCards}
          onClose={() => setIsDeleting(false)}
          onComplete={() => setSelectedCards([])}
        />
      )}

      {isRenaming && !isMobile && (
        <PopUpModal
          title="앨범명 변경"
          onClose={() => setIsRenaming(false)}
          buttonType="double"
          secondaryLabel="닫기"
          onSecondary={() => setIsRenaming(false)}
          primaryLabel="변경하기"
          onPrimary={handleRename}
          primaryDisabled={renameDisabled}
        >
          {renameInput}
        </PopUpModal>
      )}
      {isMobile && (
        <BottomSheet
          isOpen={isRenaming}
          title="앨범명 변경"
          showCloseIcon
          onClose={() => setIsRenaming(false)}
        >
          {renameInput}
          <div className={styles.renameButtons}>
            <OutlinedButton size="large" onClick={() => setIsRenaming(false)}>
              닫기
            </OutlinedButton>
            <SolidButton size="large" onClick={handleRename} disabled={renameDisabled}>
              변경하기
            </SolidButton>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
