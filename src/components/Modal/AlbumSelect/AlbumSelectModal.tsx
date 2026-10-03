import Modal from "@/components/common/PopUp/Modal/Modal";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import Alert from "@/components/common/PopUp/Alert/Alert";
import Backdrop from "@/components/common/PopUp/Backdrop/Backdrop";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import { useMyAlbums } from "@/api/me/getMyAlbums";
import { useDeviceStore } from "@/states/deviceStore";

import styles from "./AlbumSelectModal.module.scss";

interface AlbumSelectModalProps {
  close: () => void;
  selectedAlbumId: string | null;
  onSelect: (id: string | null, name: string) => void;
}

export default function AlbumSelectModal({
  close,
  selectedAlbumId,
  onSelect,
}: AlbumSelectModalProps) {
  const { data: albums = [] } = useMyAlbums();
  const { isMobile } = useDeviceStore();
  const isEmpty = albums.length === 0;

  const handleSelect = (id: string | null, name: string) => {
    onSelect(id, name);
    close();
  };

  if (isEmpty) {
    return (
      <Backdrop>
        <Alert
          variant="content"
          title="아직 생성된 앨범이 없어요"
          size="xl"
          contentText="전체 앨범에 업로드 되며, 새 앨범은 프로필 화면에서 추가할 수 있어요"
          primaryLabel="확인"
          onPrimary={close}
        />
      </Backdrop>
    );
  }

  const list = (
    <div className={styles.list}>
      <ListItem
        type="optionCard"
        text="전체 앨범"
        active={selectedAlbumId == null}
        onClick={() => handleSelect(null, "전체 앨범")}
      />
      {albums.map((album) => (
        <ListItem
          key={album.id}
          type="optionCard"
          text={album.name}
          active={selectedAlbumId === album.id}
          onClick={() => handleSelect(album.id, album.name)}
        />
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen onClose={close} title="앨범 선택" showCloseIcon>
        {list}
      </BottomSheet>
    );
  }

  return (
    <Modal title="앨범 선택" onClose={close}>
      {list}
    </Modal>
  );
}
