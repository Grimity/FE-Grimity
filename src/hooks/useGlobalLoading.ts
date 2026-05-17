import { useEffect } from "react";
import { useLoadingStore } from "@/states/loadingStore";

export function useGlobalLoading(isLoading: boolean) {
  const { show, hide } = useLoadingStore();

  useEffect(() => {
    if (isLoading) {
      show();
      return () => hide();
    }
  }, [isLoading, show, hide]);
}
