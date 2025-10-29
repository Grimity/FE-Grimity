import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { useNavigationStore } from "@/states/navigationStore";

export const useNavigationTracker = () => {
  const router = useRouter();
  const isPopStateRef = useRef(false);

  const { increaseDepth, decreaseDepth } = useNavigationStore();

  useEffect(() => {
    const handleBeforePopState = () => {
      isPopStateRef.current = true;
      decreaseDepth();
      return true;
    };

    const handleRouteChangeComplete = () => {
      if (!isPopStateRef.current) {
        increaseDepth();
      }
      isPopStateRef.current = false;
    };

    router.beforePopState(handleBeforePopState);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.beforePopState(() => true);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [increaseDepth, decreaseDepth, router]);
};
