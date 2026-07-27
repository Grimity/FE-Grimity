import { useCallback } from "react";
import { useRouter } from "next/router";

import axiosInstance from "@/constants/baseurl";
import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";

export function useLogout() {
  const router = useRouter();
  const setIsLoggedIn = useAuthStore((s) => s.setIsLoggedIn);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUserId = useAuthStore((s) => s.setUserId);
  const resetChat = useChatStore((s) => s.reset);

  return useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosInstance.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "exclude-access-token": true,
            },
          },
        );
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      setAccessToken("");
      setUserId("");
      resetChat();
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [resetChat, router, setAccessToken, setIsLoggedIn, setUserId]);
}
