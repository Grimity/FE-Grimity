import React from "react";

interface HighlightedTextProps {
  text: string;
  searchKeyword?: string;
  highlightClassName?: string;
}

/**
 * 검색어가 포함된 텍스트에서 해당 부분을 하이라이트하는 컴포넌트
 */
export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchKeyword,
  highlightClassName = "highlighted",
}) => {
  if (!searchKeyword || !text) {
    return <>{text}</>;
  }

  // 검색어로 텍스트를 분할하여 하이라이트 처리
  const parts = text.split(new RegExp(`(${searchKeyword})`, "gi"));

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === searchKeyword.toLowerCase();
        return isMatch ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
};

/**
 * 검색어 하이라이트 유틸리티 함수
 * @param text 원본 텍스트
 * @param searchKeyword 검색할 키워드
 * @returns 하이라이트된 JSX 요소
 */
export const highlightSearchKeyword = (
  text: string,
  searchKeyword?: string,
  highlightClassName?: string,
): React.ReactNode => {
  return (
    <HighlightedText
      text={text}
      searchKeyword={searchKeyword}
      highlightClassName={highlightClassName}
    />
  );
};
