import clsx from "clsx";
import styles from "./Backdrop.module.scss";
import type { BackdropProps } from "./Backdrop.types";

/**
 * 화면 중앙 정렬 모달용 공용 backdrop(딤 오버레이) primitive.
 * 자체 backdrop을 갖지 않는 DS 컴포넌트(PopUp/Modal, PopUp/Alert 등)를
 * 화면 중앙에 띄울 때 공통으로 사용한다. role/aria/onClick 등은 ...rest로 전달한다.
 */
export default function Backdrop({ children, className, ...rest }: BackdropProps) {
  return (
    <div className={clsx(styles.backdrop, className)} {...rest}>
      {children}
    </div>
  );
}
