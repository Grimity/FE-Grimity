"use client";

import { useEffect, useRef, useState } from "react";

// 한 번 화면에 들어와 요청한 이미지는 다시 마운트될 때 바로 렌더링한다.
// 뒤로가기 스크롤 복원 시 화면 밖 이미지가 placeholder로 남아 문서 높이가 줄어드는 것을 막는다.
const requestedSrcs = new Set<string>();

export function useInViewImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string | null>(() =>
    requestedSrcs.has(src) ? src : null,
  );
  const [isInView, setIsInView] = useState(() => requestedSrcs.has(src));

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (requestedSrcs.has(src)) {
      setIsInView(true);
      setImageSrc(src);
      return;
    }

    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestedSrcs.add(src);
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      },
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src]);

  return { imgRef, imageSrc, isInView };
}
