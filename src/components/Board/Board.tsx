import styles from "./Board.module.scss";
import BoardAll from "./BoardAll/BoardAll";

export default function Board() {
  return (
    <div className={styles.container}>
      <BoardAll hasChip />
    </div>
  );
}
