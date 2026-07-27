import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "information";
type ToastContainer = "global" | "local";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  container: ToastContainer;
  duration: number | null;
}

interface ToastState {
  toasts: Toast[];
  showToast: (
    message: string,
    type: ToastType,
    duration?: number | null,
    container?: ToastContainer
  ) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const MAX_TOASTS = 3;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (message, type, duration = 4000, container = "global") => {
    const id = `toast-${Date.now()}-${Math.random()}`;

    set((state) => {
      let newToasts = [...state.toasts, { id, message, type, container, duration }];

      // Limit to maximum 3 toasts - remove oldest if exceeding limit
      if (newToasts.length > MAX_TOASTS) {
        newToasts = newToasts.slice(-MAX_TOASTS); // Keep last 3 toasts
      }

      return { toasts: newToasts };
    });
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));
