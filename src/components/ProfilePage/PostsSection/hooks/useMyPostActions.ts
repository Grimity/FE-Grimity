import { useRouter } from "next/router";
import type { MyPostResponse } from "@grimity/dto";

import { createElement } from "react";

import { deletePostsFeeds } from "@/api/posts/deletePostsId";
import { useModal } from "@/hooks/useModal";
import ConfirmDialog from "@/components/common/PopUp/ConfirmDialog/ConfirmDialog";
import { useShareModal } from "@/hooks/useShareModal";
import { useToast } from "@/hooks/useToast";

/**
 * 내 글 행의 공유·삭제 동작. 기존 AllCard(case="my-posts")와 같은 API·확인 Alert·토스트를 쓴다.
 */
export function useMyPostActions(post: MyPostResponse) {
  const router = useRouter();
  const { openModal } = useModal();
  const { sharePost } = useShareModal();
  const { showToast } = useToast();

  const share = () => {
    sharePost({ postId: post.id, title: post.title, thumbnail: post.thumbnail });
  };

  const remove = () => {
    openModal(
      (close) =>
        createElement(ConfirmDialog, {
          title: "글을 정말 삭제하시겠어요?",
          confirmLabel: "삭제하기",
          onConfirm: async () => {
            try {
              await deletePostsFeeds(post.id);
              router.reload();
            } catch {
              showToast("삭제 중 오류가 발생했습니다.", "error");
            }
          },
          onClose: close,
        }),
      undefined,
      { bare: true },
    );
  };

  return { share, remove };
}
