import clsx from "clsx";
import styles from "./Icon.module.scss";
import { IconProps } from "./Icon.types";

const SPRITE_PATH = "/sprites/icons.svg";

export default function Icon({
  name,
  size = 24,
  color,
  className,
  "aria-label": ariaLabel,
}: IconProps) {
  const isDecorative = !ariaLabel;

  return (
    <svg
      className={clsx(
        styles.icon,
        styles[`size-${size}`],
        color && styles[`color-${color}`],
        className
      )}
      width={size}
      height={size}
      aria-hidden={isDecorative ? "true" : undefined}
      role={!isDecorative ? "img" : undefined}
      aria-label={ariaLabel}
      focusable="false"
    >
      <use href={`${SPRITE_PATH}#${name}`} />
    </svg>
  );
}
