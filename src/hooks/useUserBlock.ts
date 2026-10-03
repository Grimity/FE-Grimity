import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";

interface UserBlockProps {
  isBlocked?: boolean;
  identifier?: string;
  isToastLocal?: boolean;
}

const useUserBlock = ({ identifier, isBlocked, isToastLocal }: UserBlockProps) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (isBlocked) {
      showToast("차단된 계정이에요", "error", null, isToastLocal ? "local" : "global");
    }
  }, [isBlocked, identifier, showToast]);
};

export default useUserBlock;
