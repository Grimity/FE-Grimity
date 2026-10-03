import Icon from "@/components/common/Icon/Icon";

import styles from "./EmptyChatRoom.module.scss";

const EmptyChatRoom = () => {
  return (
    <section className={styles.emptyChatRoom}>
      <Icon name="logo" className={styles.logo} />
    </section>
  );
};

export default EmptyChatRoom;
