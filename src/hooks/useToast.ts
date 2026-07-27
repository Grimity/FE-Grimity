import { useToastStore } from "@/states/toastState";

export function useToast() {
  const { toasts, showToast, removeToast, clearAllToasts } = useToastStore();

  return { toasts, showToast, removeToast, clearAllToasts };
}
