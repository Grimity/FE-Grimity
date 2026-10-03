import { ReactNode } from "react";
import { create } from "zustand";

export type ModalType =
  | "JOIN"
  | "PROFILE-ID"
  | "PROFILE-EDIT"
  | "FOLLOWER"
  | "FOLLOWING"
  | "UPLOAD"
  | "LIKE"
  | "ALBUM-SELECT";

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  isComfirm?: boolean;
  onClick?: () => void | Promise<void>;
  isFill?: boolean;
}

interface ModalStore extends ModalState {
  openModal: (modal: Omit<ModalState, "isOpen">) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  isComfirm: false,
  isFill: false,
  onClick: undefined,

  openModal: (modal) =>
    set(() => ({
      ...modal,
      isOpen: true,
    })),

  closeModal: () =>
    set(() => ({
      isOpen: false,
      type: null,
      data: null,
      isComfirm: false,
      onClick: undefined,
      isFill: false,
    })),
}));

export type ModalContent = ReactNode | ((close: () => void) => ReactNode);

type NewModalType<T = Record<string, unknown>> = {
  id: string;
  content: ModalContent;
  props?: T;
  isFill?: boolean;
  title?: string;
  bare?: boolean;
  mobileHeader?: "close" | "back";
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
    mobileHeader?: "close" | "back",
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
