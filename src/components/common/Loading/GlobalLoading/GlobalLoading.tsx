import PageLoading from "@/components/common/Loading/PageLoading/PageLoading";
import { useLoadingStore } from "@/states/loadingStore";
import styles from "./GlobalLoading.module.scss";

export default function GlobalLoading() {
  const isLoading = useLoadingStore((s) => s.count > 0);
  if (!isLoading) return null;
  return (
    <div className={styles.overlay}>
      <PageLoading />
    </div>
  );
}
