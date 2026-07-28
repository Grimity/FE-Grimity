import { useState, type SyntheticEvent } from "react";

// 로드된 이미지의 비율을 URL 기준으로 캐싱해, 같은 이미지를 다시 렌더할 때는
// 처음부터 정확한 비율로 공간을 예약한다(재방문/재렌더 시 CLS 0).
const aspectCache = new Map<string, string>();

// 로드 전 공간 예약용 기본 비율(작품 이미지가 대체로 세로형).
const DEFAULT_ASPECT_RATIO = "3 / 4";

/**
 * 이미지 로드 전에는 기본(혹은 캐시된) 비율로 공간을 예약하고,
 * 로드되면 실제 naturalWidth/Height 비율로 맞춰 CLS를 줄인다.
 */
export function useImageAspectRatio(url?: string) {
  const [aspectRatio, setAspectRatio] = useState<string>(
    () => (url && aspectCache.get(url)) || DEFAULT_ASPECT_RATIO,
  );

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;

    const ratio = `${naturalWidth} / ${naturalHeight}`;
    if (url) aspectCache.set(url, ratio);
    setAspectRatio(ratio);
  };

  return { aspectRatio, onImageLoad };
}
