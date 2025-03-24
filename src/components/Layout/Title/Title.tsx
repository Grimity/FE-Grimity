import { TitleProps } from "./Title.types";
import styles from "./Title.module.scss";
import Link from "next/link";
import IconComponent from "@/components/Asset/Icon";
import Tooltip from "@/components/Tooltip/Tooltip";

export default function Title({ children, link, subtitle, information }: TitleProps) {
  return (
    <div className={styles.container}>
      <div className={styles.subtitleContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{children}</h2>
          {information && (
            <Tooltip content={information} direction="up" trigger="click">
              <IconComponent name="information" size={20} isBtn />
            </Tooltip>
          )}
        </div>
        <h3 className={styles.subtitle}>{subtitle}</h3>
      </div>
      {link && (
        <Link href={link}>
          <p className={styles.btn}>더보기</p>
        </Link>
      )}
    </div>
  );
}
