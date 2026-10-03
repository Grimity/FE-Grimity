export const formatReplyLabel = (target: string) =>
  target === "나" ? "나에게 답장" : `${target}님에게 답장`;

export const formatReplyPreview = (content: string | null | undefined, hasImage: boolean) =>
  content || (hasImage ? "이미지" : "");
