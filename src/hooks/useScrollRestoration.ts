import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

export const useScrollRestoration = (key: string) => {
  const router = useRouter();

  const saveScrollPosition = useCallback(() => {
    const scrollPosition = window.scrollY;
    sessionStorage.setItem(key, String(scrollPosition));
  }, [key]);

  const restoreScrollPosition = useCallback(() => {
    const savedPosition = sessionStorage.getItem(key);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, [key]);

  useEffect(() => {
    restoreScrollPosition();

    const handleRouteChangeStart = () => saveScrollPosition();
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router, restoreScrollPosition, saveScrollPosition]);

  return { saveScrollPosition, restoreScrollPosition };
};
