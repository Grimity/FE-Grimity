export type DmInputType = "Default" | "Focused" | "Filled" | "Filled_log" | "Disabled" | "Answer";

export interface DmInputProps {
  type?: DmInputType;
  value?: string;
  replyText?: string;
  replyTarget?: string;
  onCancelReply?: () => void;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onImageClick?: () => void;
  className?: string;
}
