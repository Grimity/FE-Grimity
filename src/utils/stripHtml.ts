const TAG_PATTERN = /<[^>]*>/g;
const NBSP_PATTERN = /&nbsp;/g;
const AMP_PATTERN = /&amp;/g;
const LT_PATTERN = /&lt;/g;
const GT_PATTERN = /&gt;/g;

/** 에디터 HTML에서 태그와 엔티티를 제거해 순수 텍스트를 반환한다 */
export const stripHtml = (html: string) =>
  html
    .replace(TAG_PATTERN, "")
    .replace(NBSP_PATTERN, " ")
    .replace(AMP_PATTERN, "&")
    .replace(LT_PATTERN, "<")
    .replace(GT_PATTERN, ">");
