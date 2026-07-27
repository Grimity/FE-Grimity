import { useEffect } from "react";
import { useRouter } from "next/router";

import IconComponent from "../Asset/Icon";
import styles from "./Toast.module.scss";
import { useToast } from "@/hooks/useToast";

interface ToastProps {
  target?: "global" | "local";
}

export default function Toast({ target }: ToastProps = {}) {
  const { toasts, removeToast, clearAllToasts } = useToast();
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", clearAllToasts);
    return () => router.events.off("routeChangeStart", clearAllToasts);
  }, [router.events, clearAllToasts]);

  const filteredToasts = toasts.filter((t) => {
    if (target && t.container !== target) {
      return false;
    }
    return true;
  });

  if (filteredToasts.length === 0) return null;

  const hasSidebar = router.pathname !== "/login";

  return (
    <>
      {filteredToasts.map((toast, index) => {
          let borderColor = "";

          switch (toast.type) {
            case "success":
              borderColor = styles.success;
              break;
            case "error":
              borderColor = styles.error;
              break;
            case "warning":
              borderColor = styles.warning;
              break;
            case "information":
              borderColor = styles.information;
              break;
            default:
              borderColor = "";
          }

          const containerClass =
            toast.container === "global"
              ? hasSidebar
                ? styles.global
                : styles.globalCenter
              : styles.local;

          const baseOffset = toast.container === "global" ? 80 : 16;
          const topPosition = baseOffset + (index * 80);

          return (
            <div
              key={toast.id}
              className={`${styles.toast} ${containerClass} ${borderColor}`}
              style={{ top: `${topPosition}px` }}
            >
              <IconComponent name={toast.type} size={30} />
              {toast.message}
              <button
                className={styles.closeButton}
                onClick={() => removeToast(toast.id)}
                aria-label="Close toast"
              >
                ×
              </button>
            </div>
          );
        })}
    </>
  );
}
