import CircularLoading from "@/components/common/Loading/CircularLoading/CircularLoading";
import { useLoadingStore } from "@/states/loadingStore";
import styles from "./GlobalLoading.module.scss";

export default function GlobalLoading() {
  const isLoading = useLoadingStore((s) => s.count > 0);
  if (!isLoading) return null;
  return (
    <div className={styles.overlay}>
      <CircularLoading />
    </div>
  );
}
