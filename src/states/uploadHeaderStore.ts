import { create } from "zustand";

interface UploadHeaderState {
  active: boolean; // 업로드 폼이 모바일에서 마운트되어 GNB 제출을 쓸 때 true
  label: string; // "업로드" | "수정"
  disabled: boolean; // 제출 불가(제목/내용/이미지 비어있음) 여부
  submit: () => void;
  setHeader: (payload: { label: string; disabled: boolean; submit: () => void }) => void;
  clear: () => void;
}

export const useUploadHeaderStore = create<UploadHeaderState>((set) => ({
  active: false,
  label: "",
  disabled: true,
  submit: () => {},
  setHeader: ({ label, disabled, submit }) => set({ active: true, label, disabled, submit }),
  clear: () => set({ active: false, label: "", disabled: true, submit: () => {} }),
}));
