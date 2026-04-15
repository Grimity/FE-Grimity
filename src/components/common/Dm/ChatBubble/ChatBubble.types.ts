export type ChatBubbleType = "Others" | "Default";

export type ChatBubbleState =
  | "Default"
  | "Sand"
  | "Hovered"
  | "Heart"
  | "RightSlide"
  | "Answer1"
  | "Answer2"
  | "images";

export interface ChatBubbleProps {
  type?: ChatBubbleType;
  state?: ChatBubbleState;
  text?: string;
  replyText?: string;
  replyTarget?: string;
  imageSrc?: string;
  onLike?: () => void;
  onReply?: () => void;
  className?: string;
}
