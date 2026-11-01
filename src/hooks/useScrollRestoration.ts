import Router from "next/router";
import { useEffect } from "react";

// 데이터가 늦게 렌더링되어 문서 높이가 부족할 때 복원을 재시도하는 최대 시간
const RESTORE_TIMEOUT_MS = 3000;

// Next는 히스토리 엔트리마다 고유한 key를 history.state에 저장한다.
// push로 새로 진입하면 새 key가 생기고, 뒤로/앞으로 가기면 기존 key로 돌아온다.
const getHistoryEntryKey = (): string | undefined =>
  (window.history.state as { key?: string } | null)?.key;

/**
 * 뒤로가기/앞으로가기로 돌아왔을 때만 해당 히스토리 엔트리의 스크롤 위치를 복원한다.
 * 링크 클릭(push)으로 진입한 경우에는 저장된 위치가 없으므로 Next 기본 동작(최상단)을 따른다.
 */
export const useScrollRestoration = (key: string) => {
  useEffect(() => {
    let entryKey = getHistoryEntryKey();
    let lastScrollY = window.scrollY;
    let isNavigating = false;
    let frameId = 0;

    const storageKey = (entry: string) => `${key}:${entry}`;

    const save = () => {
      if (!entryKey) return;
      sessionStorage.setItem(storageKey(entryKey), String(lastScrollY));
    };

    const cancelRestore = () => cancelAnimationFrame(frameId);

    const restore = () => {
      cancelRestore();
      entryKey = getHistoryEntryKey();
      const saved = entryKey ? sessionStorage.getItem(storageKey(entryKey)) : null;
      if (saved === null) return;

      const targetY = Number(saved);
      const startedAt = performance.now();

      const tick = () => {
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.min(targetY, maxY));
        if (maxY >= targetY || performance.now() - startedAt > RESTORE_TIMEOUT_MS) return;
        frameId = requestAnimationFrame(tick);
      };
      // Next의 라우트 변경 후 스크롤 리셋이 끝난 다음 프레임에 복원한다
      frameId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      if (!isNavigating) lastScrollY = window.scrollY;
    };

    // popstate 시점에는 브라우저가 이미 다음 엔트리로 바뀌었으므로 떠나는 엔트리 위치를 바로 저장한다
    const handlePopState = () => {
      if (isNavigating) return;
      isNavigating = true;
      save();
    };

    const handleRouteChangeStart = () => {
      if (isNavigating) return;
      isNavigating = true;
      save();
    };

    const handleRouteChangeEnd = () => {
      isNavigating = false;
      lastScrollY = window.scrollY;
      restore();
    };

    restore();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("popstate", handlePopState);
    // 사용자가 직접 스크롤하면 복원 재시도를 멈춘다
    window.addEventListener("wheel", cancelRestore, { passive: true });
    window.addEventListener("touchstart", cancelRestore, { passive: true });
    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeEnd);
    Router.events.on("routeChangeError", handleRouteChangeEnd);

    return () => {
      cancelRestore();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("wheel", cancelRestore);
      window.removeEventListener("touchstart", cancelRestore);
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeEnd);
      Router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [key]);
};
