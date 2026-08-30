import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { useMutation } from "@tanstack/react-query";

import { postPosts } from "@/api/posts/postPosts";

import PostForm from "@/components/Board/BoardWrite/PostForm/PostForm";
import Alert from "@/components/common/PopUp/Alert/Alert";
import Backdrop from "@/components/common/PopUp/Backdrop/Backdrop";

import { useToast } from "@/hooks/useToast";
import { event as gtagEvent } from "@/constants/gtag";
import { stripHtml } from "@/utils/stripHtml";

const POST_TYPE_MAP = {
  일반: "NORMAL",
  질문: "QUESTION",
  피드백: "FEEDBACK",
} as const;

export default function BoardWrite() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("일반");
  const [content, setContent] = useState("");
  const [exitConfirmUrl, setExitConfirmUrl] = useState<string | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const hasContent =
    title.trim().length > 0 || stripHtml(content).trim().length > 0 || content.includes("<img");
  const hasContentRef = useRef(hasContent);
  const allowNavigationRef = useRef(false);

  useEffect(() => {
    hasContentRef.current = hasContent;
  }, [hasContent]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasContentRef.current && !allowNavigationRef.current) {
        e.preventDefault();
        return (e.returnValue = "작성한 내용들은 모두 초기화돼요");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (!hasContentRef.current || allowNavigationRef.current) return;

      router.events.emit("routeChangeError");
      setExitConfirmUrl(url);
      throw "routeChange aborted.";
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  const { mutateAsync: createPost, isPending: isCreatePostLoading } = useMutation({
    mutationFn: postPosts,
  });

  const handleConfirmExit = () => {
    const url = exitConfirmUrl;
    allowNavigationRef.current = true;
    setExitConfirmUrl(null);
    router.push(url ?? "/board");
  };

  const handleSubmit = async () => {
    if (isCreatePostLoading) {
      return;
    }

    if (!title.trim()) {
      showToast("제목을 입력해주세요.", "error");
      return;
    }

    if (!stripHtml(content).trim().length && !content.includes("<img")) {
      showToast("내용을 입력해주세요.", "error");
      return;
    }

    try {
      const response = await createPost({
        title,
        content,
        type: POST_TYPE_MAP[selectedCategory as keyof typeof POST_TYPE_MAP],
      });

      // GA 게시글 업로드 완료 이벤트 추적
      gtagEvent({
        action: "upload_post",
        category: "conversion",
        label: `${selectedCategory}: ${title}`,
      });

      allowNavigationRef.current = true;
      showToast("글을 업로드했어요", "success");

      router.push(`/posts/${response.id}`);
    } catch {
      allowNavigationRef.current = false;
      showToast("글 작성에 실패했습니다.", "error");
    }
  };

  return (
    <>
      <PostForm
        formTitle="글 작성"
        title={title}
        onTitleChange={handleTitleChange}
        content={content}
        onEditorChange={handleEditorChange}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onSubmit={handleSubmit}
        isSubmitting={isCreatePostLoading}
        submitButtonText="업로드"
      />
      {exitConfirmUrl !== null && (
        <Backdrop>
          <Alert
            variant="content"
            title="업로드를 취소하고 나가시겠어요?"
            contentText="작성한 내용들은 모두 초기화돼요"
            secondaryLabel="취소"
            onSecondary={() => setExitConfirmUrl(null)}
            primaryLabel="나가기"
            onPrimary={handleConfirmExit}
          />
        </Backdrop>
      )}
    </>
  );
}
