export type ChatBubbleVariant = "mine" | "others";

export interface ChatBubbleReply {
  target: string;
  text: string;
}

export interface ChatBubbleProps {
  variant?: ChatBubbleVariant;
  text?: string;
  images?: string[];
  replyTo?: ChatBubbleReply;
  isLiked?: boolean;
  isHovered?: boolean;
  isPending?: boolean;
  showSlide?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}
