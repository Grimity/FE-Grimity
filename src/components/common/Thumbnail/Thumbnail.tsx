import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import styles from "./Thumbnail.module.scss";
import { ThumbnailProps } from "./Thumbnail.types";

const RATIO_CLASS_MAP: Record<string, string> = {
  "1/1": "ratio1_1",
  "5/4": "ratio5_4",
  "4/3": "ratio4_3",
  "3/2": "ratio3_2",
  "16/10": "ratio16_10",
  "16/9": "ratio16_9",
  "2/1": "ratio2_1",
  "21/9": "ratio21_9",
  "4/1": "ratio4_1",
  "3/4": "ratio3_4",
};

export default function Thumbnail({
  src,
  alt,
  ratio = "1/1",
  className,
}: ThumbnailProps) {
  const ratioClass = RATIO_CLASS_MAP[ratio];

  return (
    <div
      className={clsx(styles.thumbnail, styles[ratioClass], className)}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <ResponsiveImage src={src} alt={alt} className={styles.image} draggable={false} />
      ) : (
        <Icon name="logo" color="gray-subtler" className={styles.logo} />
      )}
    </div>
  );
}
