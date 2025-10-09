import { useToast } from "@/hooks/useToast";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { usePutFollow } from "@/api/users/putIdFollow";

export const useFollow = (id: string, refetchUserData: () => void) => {
  const { showToast } = useToast();
  const { mutateAsync: putFollow } = usePutFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const handleFollowClick = async () => {
    try {
      await putFollow({ id });
      refetchUserData();
    } catch (error) {
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow({ id });
      refetchUserData();
    } catch (error) {
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  return { handleFollowClick, handleUnfollowClick };
};
