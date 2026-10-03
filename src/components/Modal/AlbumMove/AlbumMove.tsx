import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getMeGetMyAlbumsQueryKey, useMeGetMyAlbums } from "@/api/generated/me/me";
import { useAlbumInsertFeeds, useAlbumRemoveFeeds } from "@/api/generated/albums/albums";

import { isUserFeedsQueryKey } from "@/components/Modal/isUserFeedsQueryKey";
import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";

import ListItem from "@/components/common/Cell/ListItem/ListItem";
import Empty from "@/components/common/Empty/Empty";
import PopUpModal from "@/components/common/PopUp/Modal/Modal";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";

import styles from "./AlbumMove.module.scss";

interface AlbumMoveProps {
  selectedFeedIds: string[];
  currentAlbumId: string | null;
  onClose: () => void;
  onComplete?: () => void;
}

export default function AlbumMove({
  selectedFeedIds,
  currentAlbumId,
  onClose,
  onComplete,
}: AlbumMoveProps) {
  const { data } = useMeGetMyAlbums();
  const albums = data ?? [];
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(currentAlbumId);

  const { mutateAsync: insertFeeds } = useAlbumInsertFeeds();
  const { mutateAsync: removeFeeds } = useAlbumRemoveFeeds();

  const { mutate: submit, isPending } = useMutation({
    mutationFn: (albumId: string | null) =>
      albumId
        ? insertFeeds({ id: albumId, data: { ids: selectedFeedIds } })
        : removeFeeds({ data: { ids: selectedFeedIds } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: ({ queryKey }) => isUserFeedsQueryKey(queryKey) });
      queryClient.invalidateQueries({ queryKey: getMeGetMyAlbumsQueryKey() });
      showToast("선택한 그림을 이동했어요", "success");
      onComplete?.();
    },
    onError: () => {
      showToast("앨범 이동에 실패했어요", "error");
    },
    onSettled: () => {
      onClose();
    },
  });

  const isEmpty = albums.length === 0;

  const content = isEmpty ? (
    <Empty
      size="md"
      iconName="illust-upload-success"
      title="아직 생성된 앨범이 없어요"
      content={"전체 앨범에 업로드 되며,\n새 앨범은 프로필 화면에서 추가할 수 있어요"}
      buttonLabel="확인"
      onButtonClick={onClose}
    />
  ) : (
    <div className={styles.albumList}>
      <ListItem
        type="optionCard"
        text="전체 앨범"
        active={selectedId === null}
        onClick={() => setSelectedId(null)}
      />
      {albums.map((album) => (
        <ListItem
          key={album.id}
          type="optionCard"
          text={album.name}
          active={selectedId === album.id}
          onClick={() => setSelectedId(album.id)}
        />
      ))}
    </div>
  );

  const buttonProps = isEmpty
    ? {}
    : ({
        buttonType: "double",
        secondaryLabel: "닫기",
        onSecondary: onClose,
        primaryLabel: isPending ? "이동 중..." : "이동하기",
        onPrimary: () => !isPending && submit(selectedId),
      } as const);

  if (isMobile) {
    return (
      <BottomSheet isOpen title="앨범 이동" showCloseIcon onClose={onClose} {...buttonProps}>
        {content}
      </BottomSheet>
    );
  }

  return (
    <PopUpModal title="앨범 이동" onClose={onClose} {...buttonProps}>
      {content}
    </PopUpModal>
  );
}
