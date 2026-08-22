import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { useMeGetMyAlbums } from "@/api/generated/me/me";
import { useAlbumInsertFeeds, useAlbumRemoveFeeds } from "@/api/generated/albums/albums";

import { useToast } from "@/hooks/useToast";
import { useModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";

import ListItem from "@/components/common/Cell/ListItem/ListItem";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Empty from "@/components/common/Empty/Empty";

import styles from "./AlbumMove.module.scss";

export default function AlbumMove() {
  const { data, refetch } = useMeGetMyAlbums();
  const albums = data ?? [];
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();
  const closeModal = useModalStore((state) => state.closeModal);
  const modalData = useModalStore((state) => state.data);
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedFeedIds: string[] = modalData?.selectedFeedIds || [];
  const initialId: string | null = modalData?.currentAlbumId ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  useEffect(() => {
    setSelectedId(initialId);
  }, [initialId]);

  const { mutateAsync: insertFeeds } = useAlbumInsertFeeds();
  const { mutateAsync: removeFeeds } = useAlbumRemoveFeeds();

  const { mutate: submit, isPending } = useMutation({
    mutationFn: (albumId: string | null) =>
      albumId
        ? insertFeeds({ id: albumId, data: { ids: selectedFeedIds } })
        : removeFeeds({ data: { ids: selectedFeedIds } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      showToast("선택한 그림을 이동했어요.", "success");
      modalData?.onComplete?.();
    },
    onError: () => {
      showToast("앨범 이동에 실패했습니다.", "error");
    },
    onSettled: () => {
      refetch();
      closeModal();
      router.reload();
    },
  });

  const isEmpty = albums.length === 0;

  return (
    <div className={styles.container}>
      {!isMobile && !isEmpty && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>앨범 이동</h2>
          <p className={styles.subtitle}>
            <span className={styles.count}>{selectedFeedIds.length}</span>개의 그림 선택
          </p>
        </div>
      )}

      {isEmpty ? (
        <Empty
          size="md"
          iconName="illust-upload-success"
          title="아직 생성된 앨범이 없어요"
          content={"전체 앨범에 업로드 되며,\n새 앨범은 프로필 화면에서 추가할 수 있어요"}
          buttonLabel="확인"
          onButtonClick={closeModal}
        />
      ) : (
        <>
          <div className={styles.albumsContainer}>
            <ListItem
              type="radio"
              text="전체 앨범"
              active={selectedId === null}
              onClick={() => setSelectedId(null)}
            />
            {albums.map((album) => (
              <ListItem
                key={album.id}
                type="radio"
                text={album.name}
                active={selectedId === album.id}
                onClick={() => setSelectedId(album.id)}
              />
            ))}
          </div>
          <div className={styles.btns}>
            <OutlinedButton size="large" onClick={closeModal}>
              취소
            </OutlinedButton>
            <SolidButton size="large" onClick={() => submit(selectedId)} disabled={isPending}>
              {isPending ? "이동 중..." : "완료"}
            </SolidButton>
          </div>
        </>
      )}
    </div>
  );
}
