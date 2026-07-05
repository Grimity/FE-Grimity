import styles from "./Board.module.scss";
import BoardAll from "./BoardAll/BoardAll";

export default function Board() {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <BoardAll hasChip={true} />
      </div>
    </div>
  );
}
