import Link from "next/link";

import { TitleProps } from "@/components/Layout/Title/Title.types";

import styles from "@/components/Layout/Title/Title.module.scss";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import clsx from "clsx";

export default function Title({ children, link, gap = "lg" }: TitleProps) {

  return (
    <div className={clsx(styles.container, styles[`gap-${gap}`])}>
      <h2 className={styles.title}>{children}</h2>
      {link && <TextButton variant="assistive" size="large"><Link href={link}>더보기</Link></TextButton>}
    </div>
  );
}
