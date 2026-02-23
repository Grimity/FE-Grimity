import clsx from "clsx";

import styles from "./Title.module.scss";
import { TitleProps } from "./Title.types";

export default function Title({ text, showEssential = false, htmlFor, className }: TitleProps) {
  const content = (
    <>
      {text}
      {showEssential && <span className={styles.essential}>*</span>}
    </>
  );

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={clsx(styles.title, className)}>
        {content}
      </label>
    );
  }

  return <span className={clsx(styles.title, className)}>{content}</span>;
}
