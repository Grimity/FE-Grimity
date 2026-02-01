import DOMPurify from "dompurify";

export function linkifyText(text: string): string {
  if (!text) return "";

  // http://, https://, www. 패턴 지원
  const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

  const linkedText = text.replace(urlRegex, (match) => {
    const href = match.startsWith("www.") ? `https://${match}` : match;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="comment-link">${match}</a>`;
  });

  return DOMPurify.sanitize(linkedText, {
    ALLOWED_TAGS: ["a"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}
