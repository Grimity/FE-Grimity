import clsx from "clsx";
import styles from "./Category.module.scss";
import { CategoryProps } from "./Category.types";

export default function Category({
  size = "lg",
  active = false,
  title,
  showNumber = true,
  number,
  iconOnly,
  className,
  ...props
}: CategoryProps) {
  const isIconOnly = !!iconOnly;

  return (
    <button
      type="button"
      aria-pressed={active}
      className={clsx(
        styles.category,
        styles[size],
        { [styles.active]: active },
        isIconOnly && styles.iconOnly,
        className,
      )}
      {...props}
    >
      {isIconOnly ? (
        iconOnly
      ) : (
        <>
          <span className={styles.title}>{title}</span>
          {showNumber && <span className={styles.number}>{number}</span>}
        </>
      )}
    </button>
  );
}
