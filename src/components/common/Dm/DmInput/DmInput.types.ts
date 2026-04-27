import type { KeyboardEvent, Ref } from "react";

export interface DmInputAttachedImage {
  fileName: string;
  fullUrl: string;
}

export interface DmInputReply {
  target: string;
  text: string;
}

export interface DmInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onImageClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  inputRef?: Ref<HTMLTextAreaElement>;
  images?: DmInputAttachedImage[];
  onRemoveImage?: (index: number) => void;
  replyTo?: DmInputReply;
  onCancelReply?: () => void;
  disabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
  className?: string;
}
