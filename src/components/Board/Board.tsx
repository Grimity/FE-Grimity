import styles from "./Board.module.scss";
import BoardAll from "./BoardAll/BoardAll";
import { useDeviceStore } from "@/states/deviceStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import Link from "next/link";
import { PATH_ROUTES } from "@/constants/routes";
import Icon from "@/components/Asset/IconTemp";

export default function Board() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);

  useIsMobile();

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <BoardAll hasChip={true} />
        {(isMobile || isTablet) && (
          <Link href={PATH_ROUTES.BOARD_WRITE}>
            <button className={styles.uploadButton} tabIndex={0}>
              <Icon icon="plus" size="3xl" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
