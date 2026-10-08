import { useRouter } from "next/router";
import type { MyPostResponse } from "@grimity/dto";

import { deletePostsFeeds } from "@/api/posts/deletePostsId";
import { useModalStore } from "@/states/modalStore";
import { useShareModal } from "@/hooks/useShareModal";
import { useToast } from "@/hooks/useToast";

/**
 * 내 글 행의 공유·삭제 동작. 기존 AllCard(case="my-posts")와 같은 API·확인 Alert·토스트를 쓴다.
 */
export function useMyPostActions(post: MyPostResponse) {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const { sharePost } = useShareModal();
  const { showToast } = useToast();

  const share = () => {
    sharePost({ postId: post.id, title: post.title, thumbnail: post.thumbnail });
  };

  const remove = () => {
    openModal({
      type: null,
      data: {
        title: "글을 정말 삭제하시겠어요?",
        confirmBtn: "삭제하기",
        onClick: async () => {
          try {
            await deletePostsFeeds(post.id);
            router.reload();
          } catch {
            showToast("삭제 중 오류가 발생했습니다.", "error");
          }
        },
      },
      isComfirm: true,
    });
  };

  return { share, remove };
}
