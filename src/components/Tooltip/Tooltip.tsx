import { useState, useRef, useEffect } from "react";
import styles from "./Tooltip.module.scss";
import { TooltipProps } from "./Tooltip.types";
import IconComponent from "../Asset/Icon";

export default function Tooltip({
  direction = "down",
  trigger = "hover",
  content,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible((prev) => !prev);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    if (visible && trigger === "click") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, trigger]);

  return (
    <div
      className={styles.container}
      ref={tooltipRef}
      onMouseEnter={trigger === "hover" ? showTooltip : undefined}
      onMouseLeave={trigger === "hover" ? hideTooltip : undefined}
      onClick={trigger === "click" ? toggleTooltip : undefined}
    >
      {children}
      {visible && (
        <div className={`${styles.tooltip} ${styles[direction]}`}>
          <p>{content}</p>
          <span className={styles.arrow}></span>
        </div>
      )}
    </div>
  );
}
