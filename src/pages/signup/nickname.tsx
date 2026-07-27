import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";

import postNameCheck from "@/api/users/postNameCheck";
import { AuthProvider } from "@/api/auth/postLogin";

import Icon from "@/components/common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import TextField from "@/components/common/Input/TextField/TextField";
import HelperText from "@/components/common/Input/HelperText/HelperText";
import CheckBox from "@/components/common/Control/CheckBox/CheckBox";

import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";

import styles from "@/styles/pages/signup-nickname.module.scss";

const SIGNUP_OAUTH_KEY = "signup_oauth_data";
const NICKNAME_MAX = 12;
const NICKNAME_MIN = 2;

type OAuthData = {
  accessToken: string;
  provider: AuthProvider;
};

export default function SignupNicknamePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [nickname, setNickname] = useState("");
  const [agree, setAgree] = useState(false);
  const [oauth, setOauth] = useState<OAuthData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SIGNUP_OAUTH_KEY);
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as OAuthData;
      if (!parsed.accessToken || !parsed.provider) {
        router.replace("/login");
        return;
      }
      setOauth(parsed);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const trimmed = nickname.trim();
  const debouncedNickname = useDebounce(trimmed, 500);

  const {
    isSuccess: isAvailable,
    isError: isTaken,
    isFetching: isChecking,
  } = useQuery({
    queryKey: ["nickname-check", debouncedNickname],
    queryFn: () => postNameCheck(debouncedNickname),
    enabled: debouncedNickname.length >= NICKNAME_MIN,
    retry: false,
  });

  const canSubmit =
    trimmed.length >= NICKNAME_MIN &&
    agree &&
    !isChecking &&
    isAvailable &&
    trimmed === debouncedNickname;

  const handleSubmit = () => {
    if (!oauth || !isAvailable) return;

    if (!agree) {
      showToast("서비스 이용약관 및 개인정보취급방침에 동의해주세요.", "error");
      return;
    }

    sessionStorage.setItem(
      SIGNUP_OAUTH_KEY,
      JSON.stringify({ ...oauth, nickname: trimmed })
    );
    router.push("/signup/profile-url");
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
        <title>회원가입 - 활동명 입력 | 그리미티</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <div className={styles.subtitle}>
              <h1 className={styles.title}>활동명을 정해주세요</h1>
              <p className={styles.description}>
                작품과 함께 그리미티에서 기억될 이름이에요
              </p>
            </div>
            <div className={styles.form}>
              <div className={styles.inputField}>
                <div className={styles.textFieldWrapper}>
                  <TextField
                    variant="count"
                    size="md"
                    maxCount={NICKNAME_MAX}
                    status={isTaken ? "error" : isAvailable ? "success" : "default"}
                    placeholder="닉네임을 입력해주세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.trimStart())}
                    onKeyDown={handleKeyDown}
                    aria-invalid={isTaken}
                    aria-describedby={isTaken ? "nickname-helper" : undefined}
                  />
                  {isTaken && (
                    <HelperText
                      id="nickname-helper"
                      status="error"
                      message="중복된 닉네임입니다"
                    />
                  )}
                </div>
                <div className={styles.checkboxRow}>
                  <CheckBox
                    active={agree}
                    onClick={() => setAgree((prev) => !prev)}
                    aria-label="서비스이용약관과 개인정보취급방침 동의"
                  />
                  <label
                    className={styles.checkboxLabel}
                    onClick={() => setAgree((prev) => !prev)}
                  >
                    서비스이용약관과 개인정보취급방침에 동의합니다.
                  </label>
                </div>
              </div>
              <SolidButton
                size="large"
                className={styles.submitBtn}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                다음
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
