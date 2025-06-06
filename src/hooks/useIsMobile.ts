import { useEffect } from "react";
import { useDeviceStore } from "@/states/deviceStore";

export const useIsMobile = () => {
  useEffect(() => {
    const setIsMobile = useDeviceStore.getState().setIsMobile;
    const setIsTablet = useDeviceStore.getState().setIsTablet;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1024px)");

    const handleResize = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
    };

    // 초기 설정
    handleResize();

    // 이벤트 리스너 등록
    mobileQuery.addEventListener("change", handleResize);
    tabletQuery.addEventListener("change", handleResize);

    return () => {
      mobileQuery.removeEventListener("change", handleResize);
      tabletQuery.removeEventListener("change", handleResize);
    };
  }, []);
};
