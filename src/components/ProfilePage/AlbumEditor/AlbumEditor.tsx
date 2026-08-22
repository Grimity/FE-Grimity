import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { useMeGetMyAlbums } from "@/api/generated/me/me";
import {
  useAlbumCreate,
  useAlbumUpdateOne,
  useAlbumUpdateOrder,
  useAlbumDeleteOne,
} from "@/api/generated/albums/albums";
import type { AlbumBaseResponse } from "@/api/generated/model";

import { useToast } from "@/hooks/useToast";

import Loader from "@/components/Layout/Loader/Loader";
import Icon from "@/components/common/Icon/Icon";
import Input from "@/components/common/Input/Input/Input";
import Title from "@/components/common/Input/Title/Title";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import GroupSettings from "@/components/common/GroupSettings/GroupSettings";
import Backdrop from "@/components/common/PopUp/Backdrop/Backdrop";
import Alert from "@/components/common/PopUp/Alert/Alert";

import styles from "./AlbumEditor.module.scss";

const MAX_ALBUMS = 8;
const MAX_NAME_LENGTH = 15;

interface AlbumEditorProps {
  onExit: () => void;
}

export default function AlbumEditor({ onExit }: AlbumEditorProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, refetch } = useMeGetMyAlbums();

  const [albums, setAlbums] = useState<AlbumBaseResponse[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [newName, setNewName] = useState("");
  const [createError, setCreateError] = useState("");
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [deletingAlbum, setDeletingAlbum] = useState<AlbumBaseResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setAlbums(data);
      setNames(Object.fromEntries(data.map((a) => [a.id, a.name])));
    }
  }, [data]);

  const { mutateAsync: createAlbum, isPending: isCreating } = useAlbumCreate();
  const { mutateAsync: updateAlbum } = useAlbumUpdateOne();
  const { mutateAsync: updateOrder } = useAlbumUpdateOrder();
  const { mutateAsync: deleteAlbum } = useAlbumDeleteOne();

  const orderChanged = !!data && data.map((a) => a.id).join(",") !== albums.map((a) => a.id).join(",");
  const nameChanged = albums.some((a) => (names[a.id] ?? a.name).trim() !== a.name);
  const hasChanges = orderChanged || nameChanged;

  const handleCreateAlbum = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setCreateError("앨범명은 비워둘 수 없습니다.");
      return;
    }
    if (albums.some((a) => a.name === trimmed)) {
      setCreateError("중복된 이름은 사용하실 수 없어요");
      return;
    }
    if (albums.length >= MAX_ALBUMS) {
      setCreateError("최대 8개의 앨범을 만들 수 있어요.");
      return;
    }

    try {
      await createAlbum({ data: { name: trimmed } });
      setNewName("");
      setCreateError("");
      refetch();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        showToast(err.response?.data?.message || "앨범 추가에 실패했습니다.", "error");
      } else {
        showToast("앨범 추가에 실패했습니다.", "error");
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(albums);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setAlbums(reordered);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAlbum) return;
    try {
      await deleteAlbum({ id: deletingAlbum.id });
      showToast("앨범이 삭제되었습니다.", "success");
      setDeletingAlbum(null);
      refetch();
    } catch {
      showToast("앨범 삭제에 실패했습니다.", "error");
    }
  };

  const handleSave = async () => {
    if (!data || !hasChanges) return;

    const trimmedNames = Object.fromEntries(
      Object.entries(names).map(([id, value]) => [id, value.trim()]),
    );

    if (Object.values(trimmedNames).some((value) => !value)) {
      showToast("앨범명은 비워둘 수 없습니다.", "error");
      return;
    }

    const usedNames = new Set<string>();
    for (const album of albums) {
      const value = trimmedNames[album.id] ?? album.name;
      if (usedNames.has(value)) {
        showToast("중복된 이름은 사용하실 수 없어요", "error");
        return;
      }
      usedNames.add(value);
    }

    setIsSaving(true);
    try {
      const renamed = albums.filter((a) => trimmedNames[a.id] !== a.name);
      for (const album of renamed) {
        await updateAlbum({ id: album.id, data: { name: trimmedNames[album.id] } });
      }

      if (orderChanged) {
        await updateOrder({ data: { ids: albums.map((a) => a.id) } });
      }

      showToast("앨범 정보가 변경되었습니다.", "success");
      router.reload();
    } catch {
      showToast("앨범 정보 변경에 실패했습니다.", "error");
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1 className={styles.pageTitle}>앨범 편집</h1>

        <div className={styles.section}>
          <Title text="새 앨범 추가" />
          <div className={styles.createRow}>
            <Input
              inputType="textfield"
              helperMessage={createError || "앨범은 최대 8개까지 추가 가능합니다."}
              helperStatus={createError ? "error" : "default"}
              className={styles.createInput}
              textFieldProps={{
                placeholder: "예시 : '크로키' 또는 '일러스트'",
                value: newName,
                maxLength: MAX_NAME_LENGTH,
                onChange: (e) => {
                  setCreateError("");
                  setNewName(e.target.value);
                },
                onKeyDown: (e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateAlbum();
                  }
                },
              }}
            />
            <SolidButton size="large" onClick={handleCreateAlbum} disabled={isCreating}>
              추가
            </SolidButton>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.editBar}>
            <Title text="앨범 목록" />
            {albums.length > 1 && (
              <TextButton
                variant={isEditingOrder ? "primary" : "assistive"}
                size="regular"
                onClick={() => setIsEditingOrder((prev) => !prev)}
              >
                {isEditingOrder ? "완료" : "순서 편집"}
              </TextButton>
            )}
          </div>

          {albums.length === 0 ? (
            <p className={styles.emptyText}>생성된 앨범이 없어요.</p>
          ) : isEditingOrder ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="albumList">
                {(provided) => (
                  <div
                    className={styles.albumList}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {albums.map((album, index) => (
                      <Draggable key={album.id} draggableId={album.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <GroupSettings
                              title={album.name}
                              state="enabled"
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className={styles.albumList}>
              {albums.map((album) => (
                <GroupSettings
                  key={album.id}
                  title={names[album.id] ?? album.name}
                  state="editDelete"
                  onDelete={() => setDeletingAlbum(album)}
                >
                  <input
                    className={styles.albumNameInput}
                    value={names[album.id] ?? ""}
                    maxLength={MAX_NAME_LENGTH}
                    onChange={(e) =>
                      setNames((prev) => ({ ...prev, [album.id]: e.target.value }))
                    }
                  />
                </GroupSettings>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInner}>
          <TextButton
            variant="primary"
            size="regular"
            iconLeft={<Icon name="chevron-left" size={20} />}
            onClick={onExit}
          >
            돌아가기
          </TextButton>
          <TextButton
            variant="primary"
            size="regular"
            onClick={handleSave}
            disabled={!hasChanges || isSaving || isEditingOrder}
          >
            저장하기
          </TextButton>
        </div>
      </div>

      {deletingAlbum && (
        <Backdrop onClick={() => setDeletingAlbum(null)}>
          <Alert
            variant="content"
            title="앨범을 삭제할까요?"
            contentText={"앨범을 삭제하면\n그림은 전체 항목으로 이동돼요"}
            secondaryLabel="아니요"
            onSecondary={() => setDeletingAlbum(null)}
            primaryLabel="삭제하기"
            onPrimary={handleConfirmDelete}
          />
        </Backdrop>
      )}
    </div>
  );
}
