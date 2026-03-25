import {
  useCallback,
  useMemo,
  type Dispatch,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type SetStateAction,
} from "react";

/**
 * Enter/Space로 버튼 활성화할 때 사용하는 핸들러
 */
export function useKeyDownActivate(
  handler: (() => void) | undefined,
): KeyboardEventHandler | undefined {
  return useMemo(() => {
    if (!handler) return undefined;
    return (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    };
  }, [handler]);
}

/** Enter/Space 시 `stopPropagation`까지 호출 (중첩된 클릭 영역 등). */
export function useKeyDownActivateStopPropagation(
  handler: (() => void) | undefined,
): KeyboardEventHandler | undefined {
  return useMemo(() => {
    if (!handler) return undefined;
    return (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        handler();
      }
    };
  }, [handler]);
}

/**
 * 제어/비제어 토글
 */
export function useToggleWithCallback(
  isControlled: boolean,
  setInternal: Dispatch<SetStateAction<boolean>>,
  onAfter?: () => void,
) {
  return useCallback(() => {
    if (!isControlled) setInternal((prev) => !prev);
    onAfter?.();
  }, [isControlled, setInternal, onAfter]);
}
