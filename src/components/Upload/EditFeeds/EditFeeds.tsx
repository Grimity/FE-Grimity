import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useDetails } from "@/api/feeds/getFeedsId";
import { CreateFeedRequest } from "@/api/feeds/putFeedsId";

import { useAuthStore } from "@/states/authStore";

import Loader from "@/components/Layout/Loader/Loader";
import FeedForm from "@/components/Upload/FeedForm/FeedForm";

import { useToast } from "@/hooks/useToast";
import { useFeedSubmit } from "@/hooks/useFeedSubmit";

import type { FeedData } from "@/components/Upload/FeedForm/FeedForm.types";

interface EditFeedsProps {
  id: string;
}

export default function EditFeeds({ id }: EditFeedsProps) {
  const router = useRouter();

  const [formHandlers, setFormHandlers] = useState<{ resetUnsavedChanges: () => void } | null>(
    null,
  );

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { showToast } = useToast();
  const { submitFeed } = useFeedSubmit();

  const { data: feedData, isLoading: isFetching } = useDetails(id);

  useEffect(() => {
    if (isFetching) return;
    if (!isLoggedIn) {
      showToast("로그인 후 작성 가능합니다.", "warning");
      router.push("/");
    } else if (feedData && user_id !== feedData?.author.id) {
      showToast("수정 권한이 없습니다.", "error");
      router.push("/");
    }
  }, [isLoggedIn, router, user_id, feedData, showToast, isFetching]);

  if (isFetching) return <Loader />;
  if (!feedData) return <div>피드 데이터를 불러오지 못했습니다.</div>;

  const initialValues: FeedData = {
    title: feedData.title,
    content: feedData.content,
    tags: feedData.tags,
    images: feedData.cards.map((name) => ({
      name,
      url: name,
      originalName: name,
    })),
    thumbnailName: feedData.thumbnail,
    thumbnailUrl: feedData.thumbnail,
    albumId: feedData.album?.id || null,
    albumName: feedData.album?.name || "",
  };

  const handleSubmit = (data: CreateFeedRequest) => {
    submitFeed({
      isEditMode: true,
      id,
      data,
      onSuccess: () => formHandlers?.resetUnsavedChanges(),
    });
  };

  return (
    <FeedForm
      isEditMode
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onStateUpdate={setFormHandlers}
    />
  );
}
