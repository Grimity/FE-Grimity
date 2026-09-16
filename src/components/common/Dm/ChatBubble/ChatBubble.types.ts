export type ChatBubbleVariant = "mine" | "others";

export interface ChatBubbleReply {
  target: string;
  text: string;
}

export interface ChatBubbleProps {
  variant?: ChatBubbleVariant;
  /** 스크롤 이동 대상 식별용. 컨테이너에 data-message-id로 부여된다. */
  messageId?: string;
  text?: string;
  images?: string[];
  replyTo?: ChatBubbleReply;
  isLiked?: boolean;
  isHovered?: boolean;
  isPending?: boolean;
  showSlide?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  /** 인용된 답장 미리보기 클릭 시(원본 말풍선으로 이동) */
  onReplyClick?: () => void;
  /** 첨부 이미지 클릭 시(뷰어 오픈). 클릭한 이미지의 인덱스를 넘긴다. */
  onImageClick?: (index: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}
