import { useCallback, useEffect, useRef } from "react";

/**
 * ESC 키와 브라우저 뒤로가기(popstate)로 오버레이를 닫는다.
 * 마운트 시 history를 한 번 push해 뒤로가기를 닫기 동작으로 흡수한다.
 *
 * ESC·오버레이 클릭·닫기 버튼 등 popstate가 아닌 경로로 닫을 때는 반환된 `close`를
 * 사용해야 한다. `close`는 push한 더미 엔트리를 history.back()으로 정리하므로,
 * 닫은 뒤 사용자가 뒤로가기를 눌렀을 때 빈 엔트리가 소모되는 문제가 발생하지 않는다.
 *
 * @returns popstate가 아닌 경로에서 사용할 정리 포함 닫기 함수
 */
export function useEscapeAndBackClose(onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closedRef = useRef(false);

  const close = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    // push한 더미 엔트리 정리. 이때 발생하는 popstate는 closedRef로 무시된다.
    history.back();
    onCloseRef.current();
  }, []);

  useEffect(() => {
    history.pushState(null, "", location.href);

    // 브라우저 뒤로가기로 닫는 경로: 더미 엔트리가 이미 소모되므로 back() 불필요.
    const handlePopState = () => {
      if (closedRef.current) return;
      closedRef.current = true;
      onCloseRef.current();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  return close;
}
