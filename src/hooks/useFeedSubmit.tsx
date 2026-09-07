import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { postFeeds } from "@/api/feeds/postFeeds";
import { putEditFeeds } from "@/api/feeds/putFeedsId";
import { event as gtagEvent } from "@/constants/gtag";

import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import PageLoading from "@/components/common/Loading/PageLoading/PageLoading";

import type { CreateFeedRequest } from "@grimity/dto";

const UPLOAD_LOADING_DELAY = 2000;

interface SubmitParams {
  isEditMode: boolean;
  id?: string;
  data: CreateFeedRequest;
  /** 성공 시 상세페이지로 이동하기 전에 호출한다(이탈 가드 해제 등). */
  onSuccess?: () => void;
}

/**
 * 그림 업로드/수정을 확인 모달 없이 바로 실행하고, 성공 시 상세페이지로 이동한다.
 * 2초 이상 걸리면 로딩 모달을 노출한다.
 */
export function useFeedSubmit() {
  const router = useRouter();
  const { showToast } = useToast();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeLoadingRef = useRef<(() => void) | null>(null);
  const onSuccessRef = useRef<(() => void) | undefined>(undefined);
  // isPending은 파생값이라 mutate 직후 렌더 전에는 아직 false다.
  // 빠른 더블클릭으로 두 번 제출되는 것을 막기 위해 동기 플래그로 가드한다.
  const isSubmittingRef = useRef(false);

  const startLoading = () => {
    loadingTimerRef.current = setTimeout(() => {
      closeLoadingRef.current = openModal(() => (
        <PageLoading
          title="이미지를 업로드 중이에요"
          description="이미지 업로드 도중 화면을 닫거나 뒤로가면 업로드가 중단될 수 있어요"
        />
      ));
    }, UPLOAD_LOADING_DELAY);
  };

  const stopLoading = () => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    closeLoadingRef.current?.();
    closeLoadingRef.current = null;
  };

  // 언마운트 시 대기 중인 로딩 타이머/모달 정리 (업로드 직후 뒤로가기 대응)
  useEffect(() => stopLoading, []);

  const { mutate: uploadFeed, isPending: isUploadPending } = useMutation({
    mutationFn: postFeeds,
    onSuccess: (response, variables) => {
      stopLoading();

      if (!response.id) {
        // 이탈하지 않으므로 재시도할 수 있도록 가드 해제
        isSubmittingRef.current = false;
        showToast("업로드 중 문제가 발생했습니다. 다시 시도해주세요.", "error");
        return;
      }
      // 성공 시 상세로 이동하며 언마운트되므로 가드는 그대로 둔다(이동 중 재클릭 방지)

      gtagEvent({
        action: "upload_feed",
        category: "conversion",
        label: variables.title,
      });

      showToast("그림을 업로드했어요", "success");
      onSuccessRef.current?.();
      router.push(`/feeds/${response.id}`);
    },
    onError: (error) => {
      stopLoading();
      isSubmittingRef.current = false;

      if (error instanceof AxiosError && error.response?.status === 400) {
        showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
        return;
      }
      showToast("업로드 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    },
  });

  const { mutate: editFeed, isPending: isEditPending } = useMutation({
    mutationFn: putEditFeeds,
    onSuccess: (_response, variables) => {
      stopLoading();
      // 성공 시 상세로 이동하며 언마운트되므로 가드는 그대로 둔다(이동 중 재클릭 방지)
      showToast("수정이 완료되었습니다!", "success");
      // 상세 페이지 쿼리 키는 ["details", id] (getFeedsId.ts)
      queryClient.invalidateQueries({ queryKey: ["details", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["feeds"] });

      onSuccessRef.current?.();
      router.push(`/feeds/${variables.id}`);
    },
    onError: (error: AxiosError) => {
      stopLoading();
      isSubmittingRef.current = false;
      showToast("수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
      if (error.response?.status === 400) {
        showToast("잘못된 요청입니다. 입력값을 확인해주세요.", "error");
      }
    },
  });

  const isSubmitting = isUploadPending || isEditPending;

  const submitFeed = ({ isEditMode, id, data, onSuccess }: SubmitParams) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    onSuccessRef.current = onSuccess;
    startLoading();

    if (isEditMode && id) {
      editFeed({ id, data });
    } else {
      uploadFeed(data);
    }
  };

  return { submitFeed, isSubmitting };
}
