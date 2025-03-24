import styles from "./ProfileId.module.scss";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import { authState } from "@/states/authState";
import Button from "@/components/Button/Button";
import { useToast } from "@/hooks/useToast";
import axiosInstance from "@/constants/baseurl";
import { isValidProfileIdFormat, isForbiddenProfileId } from "@/utils/isValidProfileId";
import TextField from "@/components/TextField/TextField";
import { useMutation } from "react-query";

export default function ProfileId() {
  const [profileId, setProfileId] = useState("");
  const [, setAuth] = useRecoilState(authState);
  const [modal, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.post("/auth/register", {
          provider: modal.data.provider,
          providerAccessToken: modal.data.accessToken,
          name: modal.data.nickname,
          url: profileId.trim(),
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 409) {
          setErrorMessage("이미 사용 중인 프로필 url입니다.");
        } else if (error.response?.status === 400) {
          setErrorMessage("숫자, 영문(소문자), 언더바(_)만 입력 가능합니다.");
        } else {
          showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
        }
        throw new Error("ErrorHandled");
      }
    },
    onSuccess: (data) => {
      setAuth({
        access_token: data.accessToken,
        isLoggedIn: true,
        user_id: data.id,
      });

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken || "");
      setModal({ isOpen: true, type: "JOIN", data: null });
    },
    onError: (error: any) => {
      if (error.message !== "ErrorHandled") {
        showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      }
    },
  });

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!profileId.trim()) {
      setErrorMessage("프로필 URL을 입력해주세요.");
      return;
    }

    const profileIdTrimmed = profileId.trim();
    if (!isValidProfileIdFormat(profileIdTrimmed)) {
      setErrorMessage("숫자, 영문(소문자), 언더바(_)만 입력 가능합니다.");
      return;
    }

    if (isForbiddenProfileId(profileIdTrimmed)) {
      setErrorMessage("사용할 수 없는 ID입니다.");
      return;
    }

    if (!modal.data || !modal.data.accessToken || !modal.data.provider || !modal.data.nickname) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      return;
    }

    registerMutation.mutate();
  };

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>프로필 URL을 정해주세요</h2>
        <p className={styles.subtitle}>단 하나뿐인 프로필 주소로 사용되어요</p>
      </div>
      <div className={styles.textBtnContainer}>
        <div className={styles.textContainer}>
          <h6 className={styles.h6}>www.grimity.com/</h6>
          <TextField
            placeholder="숫자, 영문(소문자), 언더바(_)"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            onKeyDown={handleEnterKeyDown}
            isError={!!errorMessage}
            errorMessage={errorMessage}
          />
          <Button size="l" type="filled-primary" disabled={!profileId} onClick={handleSubmit}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
