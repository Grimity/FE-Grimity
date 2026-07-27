import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useMutation } from "@tanstack/react-query";

import postRegister from "@/api/auth/postRegister";
import { AuthProvider } from "@/api/auth/postLogin";

import { useAuthStore } from "@/states/authStore";

import Icon from "@/components/common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import TextField from "@/components/common/Input/TextField/TextField";
import HelperText from "@/components/common/Input/HelperText/HelperText";

import { useToast } from "@/hooks/useToast";

import { isValidProfileIdFormat, isForbiddenProfileId } from "@/utils/isValidProfileId";

import styles from "@/styles/pages/signup-profile-url.module.scss";

const SIGNUP_OAUTH_KEY = "signup_oauth_data";

type OAuthData = {
  accessToken: string;
  provider: AuthProvider;
  nickname: string;
};

export default function SignupProfileUrlPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);

  const [profileId, setProfileId] = useState("");
  const [oauth, setOauth] = useState<OAuthData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SIGNUP_OAUTH_KEY);
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as OAuthData;
      if (!parsed.accessToken || !parsed.provider || !parsed.nickname) {
        router.replace("/login");
        return;
      }
      setOauth(parsed);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const trimmed = profileId.trim();
  const isValidFormat = trimmed.length > 0 && isValidProfileIdFormat(trimmed);
  const isForbidden = isValidFormat && isForbiddenProfileId(trimmed);
  const hasError = trimmed.length > 0 && (!isValidFormat || isForbidden);

  const status = hasError ? "error" : isValidFormat && !isForbidden ? "success" : "default";
  const helperMessage = !isValidFormat
    ? "숫자, 영문(소문자), 언더바(_)만 사용해 입력해주세요."
    : "사용할 수 없는 ID입니다.";

  const canSubmit = trimmed.length > 0 && isValidFormat && !isForbidden;

  const { mutate: register, isPending } = useMutation({
    mutationFn: postRegister,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setIsLoggedIn(true);
      setUserId(data.id);

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken || "");
      localStorage.setItem("user_id", data.id);

      sessionStorage.removeItem(SIGNUP_OAUTH_KEY);
      router.push("/signup/complete");
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
    },
  });

  const handleSubmit = () => {
    if (!oauth || !canSubmit || isPending) return;

    register({
      provider: oauth.provider,
      providerAccessToken: oauth.accessToken,
      name: oauth.nickname,
      url: trimmed,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSubmit) handleSubmit();
    }
  };

  return (
    <>
      <Head>
        <title>회원가입 - 프로필 URL 입력 | 그리미티</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <div className={styles.subtitle}>
              <h1 className={styles.title}>프로필 URL을 정해주세요</h1>
              <p className={styles.description}>단 하나뿐인 프로필 주소로 사용돼요</p>
            </div>
            <div className={styles.form}>
              <div className={styles.inputField}>
                <p className={styles.urlPrefix}>www.grimity.com/</p>
                <div className={styles.textFieldWrapper}>
                  <TextField
                    size="md"
                    status={status as "default" | "error" | "success"}
                    placeholder="숫자, 영문(소문자), 언더바(_)"
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? "profileid-helper" : undefined}
                  />
                  {hasError && (
                    <HelperText
                      id="profileid-helper"
                      status="error"
                      message={helperMessage}
                    />
                  )}
                </div>
              </div>
              <SolidButton
                size="large"
                className={styles.submitBtn}
                disabled={!canSubmit || isPending}
                onClick={handleSubmit}
              >
                완료
              </SolidButton>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <TextButton
              variant="assistive"
              size="large"
              iconLeft={<Icon name="info-circle" size={20} />}
              onClick={() => router.push("/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a")}
              className={styles.footerBtn}
            >
              공지사항
            </TextButton>
            <TextButton
              variant="assistive"
              size="large"
              iconLeft={<Icon name="question-circle" size={20} />}
              onClick={() => window.open("https://open.kakao.com/o/sKYFewgh", "_blank", "noopener,noreferrer")}
              className={styles.footerBtn}
            >
              문의
            </TextButton>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <Link
                href="https://term.grimity.com/term"
                target="_blank"
                rel="noopener noreferrer"
              >
                이용약관
              </Link>
              <span className={styles.dot} />
              <Link
                href="https://term.grimity.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보처리방침
              </Link>
            </div>
            <p className={styles.copyright}>© Grimity. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
