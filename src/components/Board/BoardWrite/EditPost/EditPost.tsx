import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

import { usePostsDetails } from "@/api/posts/getPostsId";
import { CreatePostRequest, putEditPosts } from "@/api/posts/putPostsId";

import { useAuthStore } from "@/states/authStore";
import { useNewModalStore } from "@/states/modalStore";

import Loader from "@/components/Layout/Loader/Loader";
import PostForm from "@/components/Board/BoardWrite/PostForm/PostForm";
import ConfirmDialog from "@/components/common/PopUp/ConfirmDialog/ConfirmDialog";

import { useToast } from "@/hooks/useToast";

interface EditPostProps {
  id: string;
}

const typeMapToKo = {
  NORMAL: "일반",
  QUESTION: "질문",
  FEEDBACK: "피드백",
} as const;

export default function EditPost({ id }: EditPostProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("일반");
  const { showToast } = useToast();
  const openNewModal = useNewModalStore((state) => state.openModal);
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const { data: posts, isLoading } = usePostsDetails(id as string);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        showToast("로그인 후 작성 가능합니다.", "warning");
        router.push("/");
      } else if (user_id !== posts?.author.id) {
        router.push("/");
      }
    }
  }, [isLoggedIn, router, user_id, posts, isLoading, showToast]);

  useEffect(() => {
    if (posts) {
      setTitle(posts.title);
      setContent(posts.content);
      setSelectedCategory(typeMapToKo[posts.type as keyof typeof typeMapToKo] || "일반");
    }
  }, [posts]);

  // 변경 사항 감지
  useEffect(() => {
    if (posts) {
      const originalType = typeMapToKo[posts.type as keyof typeof typeMapToKo] || "일반";
      const hasChanges =
        title !== posts.title || content !== posts.content || selectedCategory !== originalType;
      setHasUnsavedChanges(hasChanges);
    }
  }, [posts, title, content, selectedCategory]);

  // 브라우저 이벤트 핸들러
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        return (e.returnValue = "변경사항이 저장되지 않을 수 있습니다.");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 라우터 이벤트 핸들러
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (hasUnsavedChangesRef.current) {
        router.events.emit("routeChangeError");

        openNewModal(
          uuidv4(),
          (close) => (
            <ConfirmDialog
              title="수정을 취소하고 나가시겠어요?"
              description="변경사항이 저장되지 않습니다"
              confirmLabel="나가기"
              onConfirm={() => {
                hasUnsavedChangesRef.current = false;
                setHasUnsavedChanges(false);
                router.push(url);
              }}
              onClose={close}
            />
          ),
          undefined,
          false,
          undefined,
          true,
        );

        throw "routeChange aborted.";
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router, openNewModal]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const { mutateAsync: editPost, isPending: isEditPostPending } = useMutation({
    mutationFn: (data: CreatePostRequest) => putEditPosts(id, data),
  });

  const handleSubmit = async () => {
    if (isEditPostPending) {
      return;
    }

    if (!title.trim()) {
      showToast("제목을 입력해주세요.", "error");
      return;
    }

    if (!content.trim()) {
      showToast("내용을 입력해주세요.", "error");
      return;
    }

    const typeMapToEn = {
      일반: "NORMAL",
      질문: "QUESTION",
      피드백: "FEEDBACK",
    } as const;

    try {
      await editPost({
        title,
        content,
        type: typeMapToEn[selectedCategory as keyof typeof typeMapToEn],
      });

      hasUnsavedChangesRef.current = false;
      showToast("수정이 완료되었습니다!", "success");

      router.push(`/posts/${id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
        return;
      }
      showToast("수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <PostForm
      formTitle="글 수정하기"
      title={title}
      onTitleChange={handleTitleChange}
      content={content}
      onEditorChange={handleEditorChange}
      selectedCategory={selectedCategory}
      onCategoryClick={handleCategoryClick}
      onSubmit={handleSubmit}
      isSubmitting={isEditPostPending}
      submitButtonText="수정 완료"
    />
  );
}
