import Backdrop from "@/components/common/PopUp/Backdrop/Backdrop";
import RefreshLoading from "@/components/common/Loading/RefreshLoading/RefreshLoading";

import styles from "./UploadingOverlay.module.scss";

export default function UploadingOverlay() {
  return (
    <Backdrop className={styles.backdrop} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.card}>
        <RefreshLoading size={40} />
        <div className={styles.textContainer}>
          <strong className={styles.title}>게시글을 업로드 중이에요</strong>
          <p className={styles.description}>
            업로드 도중 화면을 닫거나 뒤로가면 업로드가 중단될 수 있어요
          </p>
        </div>
      </div>
    </Backdrop>
  );
}
