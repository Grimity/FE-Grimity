import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { useToast } from "@/hooks/useToast";

import Toast from "./Toast";
import type { ToastType as PopUpToastType } from "./Toast.types";
import styles from "./ToastContainer.module.scss";

type LegacyToastType = "success" | "error" | "warning" | "information";

const LEGACY_TO_POPUP_TYPE: Record<LegacyToastType, PopUpToastType> = {
  success: "Positive",
  error: "Negative",
  warning: "Cautionary",
  information: "Info",
};

const PERSISTENT_DURATION_MS = 24 * 60 * 60 * 1000;

interface ToastContainerProps {
  target?: "global" | "local";
}

export default function ToastContainer({ target }: ToastContainerProps = {}) {
  const { toasts, removeToast } = useToast();
  const router = useRouter();
  const toastsRef = useRef(toasts);

  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  useEffect(() => {
    const handleRouteChange = () => {
      toastsRef.current.forEach((toast) => {
        removeToast(toast.id);
      });
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [removeToast, router.events]);

  const filteredToasts = toasts.filter((t) => {
    if (target && t.container !== target) {
      return false;
    }
    return true;
  });

  if (filteredToasts.length === 0) return null;

  return (
    <div
      className={clsx(
        styles.container,
        target === "local" ? styles.local : styles.global,
      )}
      aria-live="polite"
      aria-atomic="false"
    >
      {filteredToasts.map((toast) => (
        <Toast
          key={toast.id}
          type={LEGACY_TO_POPUP_TYPE[toast.type]}
          text={toast.message}
          duration={
            toast.duration === null ? PERSISTENT_DURATION_MS : toast.duration
          }
          onClose={() => removeToast(toast.id)}
          className={styles.toastItem}
        />
      ))}
    </div>
  );
}
