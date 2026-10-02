import { useEffect } from "react";

import { useToast } from "@/hooks/useToast";

const BLOCKED_PROFILE_MESSAGE = "차단된 계정이에요";

/**
 * 차단당했거나 내가 차단한 프로필에 들어오면 안내 토스트를 띄운다.
 */
export function useBlockedProfileToast(
  userId: string | undefined,
  isBlocked: boolean | undefined,
  isBlocking: boolean | undefined,
) {
  const { showToast } = useToast();

  useEffect(() => {
    if (isBlocked || isBlocking) {
      showToast(BLOCKED_PROFILE_MESSAGE, "error");
    }
  }, [userId, isBlocked, isBlocking, showToast]);
}
