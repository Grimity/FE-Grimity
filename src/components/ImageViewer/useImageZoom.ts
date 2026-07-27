import { CSSProperties, useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

interface UseImageZoomOptions {
  min?: number;
  max?: number;
  step?: number;
}

/**
 * 이미지 단계 확대/축소 + 확대 상태에서의 드래그 이동(pan)을 관리한다.
 * 슬라이드 전환 등 외부에서 reset()으로 초기화한다.
 */
export function useImageZoom({ min = 1, max = 3, step = 1 }: UseImageZoomOptions = {}) {
  const [scale, setScale] = useState(min);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const panRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const isZoomed = scale > min;

  const reset = useCallback(() => {
    setScale(min);
    setOffset({ x: 0, y: 0 });
  }, [min]);

  const zoomIn = useCallback(() => setScale((s) => Math.min(max, s + step)), [max, step]);

  const zoomOut = useCallback(
    () =>
      setScale((s) => {
        const next = Math.max(min, s - step);
        if (next === min) setOffset({ x: 0, y: 0 });
        return next;
      }),
    [min, step],
  );

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (scale <= min) return; // 확대 상태에서만 pan
      setPanning(true);
      panRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [scale, min, offset.x, offset.y],
  );

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    if (!panRef.current) return;
    setOffset({
      x: panRef.current.ox + (e.clientX - panRef.current.x),
      y: panRef.current.oy + (e.clientY - panRef.current.y),
    });
  }, []);

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    panRef.current = null;
    setPanning(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  const imageStyle: CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
    cursor: isZoomed ? "grab" : "default",
    transition: panning ? "none" : "transform 0.2s ease",
  };

  return {
    isZoomed,
    canZoomIn: scale < max,
    canZoomOut: scale > min,
    zoomIn,
    zoomOut,
    reset,
    imageStyle,
    panHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
