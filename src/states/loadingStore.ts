import { create } from "zustand";

interface LoadingState {
  count: number;
  show: () => void;
  hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  count: 0,
  show: () => set((s) => ({ count: s.count + 1 })),
  hide: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
}));
