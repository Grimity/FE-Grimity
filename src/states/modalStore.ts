import { ReactNode } from "react";
import { create } from "zustand";

export type ModalContent = ReactNode | ((close: () => void) => ReactNode);

type NewModalType<T = Record<string, unknown>> = {
  id: string;
  content: ModalContent;
  props?: T;
  isFill?: boolean;
  title?: string;
  bare?: boolean;
  mobileHeader?: "close" | "back" | "none";
};

interface NewModalState<T = Record<string, unknown>> {
  modals: NewModalType<T>[];
  openModal: (
    id: string,
    content: ModalContent,
    props?: T,
    isFill?: boolean,
    title?: string,
    bare?: boolean,
    mobileHeader?: "close" | "back" | "none",
  ) => void;
  closeModal: (id: string) => void;
}

export const useNewModalStore = create<NewModalState>((set) => ({
  modals: [],
  openModal: (id, content, props, isFill, title, bare, mobileHeader) =>
    set((state) => ({
      modals: [...state.modals, { id, content, props, isFill, title, bare, mobileHeader }],
    })),
  closeModal: (id) => set((state) => ({ modals: state.modals.filter((m) => m.id !== id) })),
}));
