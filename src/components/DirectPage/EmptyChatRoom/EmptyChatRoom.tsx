import Button from "@/components/Button/Button";
import MessageSendModal from "@/components/Modal/MessageSend/MessageSendModal";
import { useNewModalStore } from "@/states/modalStore";

import styles from "./EmptyChatRoom.module.scss";

const EmptyChatRoom = () => {
  const { openModal } = useNewModalStore();

  const handleNewMessage = () => {
    openModal("message-send", (close) => <MessageSendModal onClose={close} />);
  };

  return (
    <section className={styles.emptyChatRoom}>
      <div className={styles.emptyChatRoomTextWrapper}>
        <p className={styles.emptyChatRoomText}>다른 작가에게 사진과 메시지를 보낼 수 있어요</p>
        <Button type="filled-primary" onClick={handleNewMessage} size="m">
          새 메세지 보내기
        </Button>
      </div>
    </section>
  );
};

export default EmptyChatRoom;
