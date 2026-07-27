import Script from "next/script";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";

import postLogin, { AuthProvider } from "@/api/auth/postLogin";
import { useMyData } from "@/api/users/getMe";

import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";

import Icon from "@/components/common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import Loader from "@/components/Layout/Loader/Loader";

import { useToast } from "@/hooks/useToast";
import { CONFIG } from "@/config";

import styles from "@/styles/pages/login.module.scss";

interface AuthObj {
  access_token: string;
}

interface ErrorResponse {
  error: string;
  error_description: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
}

function getRedirectTo(v?: string | string[]): string {
  const raw = Array.isArray(v) ? v[0] : v;
  return raw?.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

const SIGNUP_OAUTH_KEY = "signup_oauth_data";

export default function LoginPage() {
  const { isLoggedIn, isAuthReady, setAccessToken, setIsLoggedIn, setUserId } = useAuthStore();
  const { setHasUnreadMessages } = useChatStore();
  const { showToast } = useToast();
  const { refetch: fetchMyData } = useMyData();
  const router = useRouter();
  const redirectTo = getRedirectTo(router.query.redirect as string | string[] | undefined);

  const goToSignup = (accessToken: string, provider: AuthProvider) => {
    sessionStorage.setItem(SIGNUP_OAUTH_KEY, JSON.stringify({ accessToken, provider }));
    router.push("/signup/nickname");
  };

  const { replace: routerReplace } = router;
  useEffect(() => {
    if (isAuthReady && isLoggedIn) {
      routerReplace(redirectTo);
    }
  }, [isAuthReady, isLoggedIn, redirectTo, routerReplace]);

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: postLogin,
    onSuccess: async (data: LoginResponse) => {
      setAccessToken(data.accessToken);
      setIsLoggedIn(true);
      setUserId(data.id);
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_id", data.id);

      try {
        const myData = await fetchMyData();
        if (myData.data) {
          setHasUnreadMessages(myData.data.hasUnreadChatMessage);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }

      router.push(redirectTo);
    },
  });

  const handleKaKaoLogin = async () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(CONFIG.AUTH.KAKAO_APP_KEY);
    }

    window.Kakao.Auth.login({
      success: async (authObj: AuthObj) => {
        try {
          await login({
            provider: AuthProvider.KAKAO,
            providerAccessToken: authObj.access_token,
          });
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 404) {
            goToSignup(authObj.access_token, AuthProvider.KAKAO);
          } else {
            showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
          }
        }
      },
      fail: (err: ErrorResponse) => {
        console.error("카카오 로그인 실패:", err);
        showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
      },
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await login({
          provider: AuthProvider.GOOGLE,
          providerAccessToken: tokenResponse.access_token,
        });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          goToSignup(tokenResponse.access_token, AuthProvider.GOOGLE);
        } else {
          showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
        }
      }
    },
    onError: () => {
      showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });

  const handleAppleLogin = async () => {
    try {
      const data = await window.AppleID.auth.signIn();
      await login({
        provider: AuthProvider.APPLE,
        providerAccessToken: data.authorization.id_token,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        const data = error.config?.data ? JSON.parse(error.config.data) : {};
        goToSignup(data.providerAccessToken, AuthProvider.APPLE);
      } else {
        showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
      }
    }
  };

  if (!isAuthReady || isLoggedIn) return <Loader />;

  return (
    <>
      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        onReady={() => {
          window.AppleID.auth.init({
            clientId: CONFIG.AUTH.APPLE_CLIENT_ID,
            scope: "name email",
            redirectURI: CONFIG.AUTH.APPLE_REDIRECT_URI,
            usePopup: true,
          });
        }}
      />
      <Head>
        <title>로그인 | 그리미티</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <Icon name="logo" color="gray-bold" className={styles.logo} aria-label="Grimity" />
            <p className={styles.tagline}>
              <span>그리미티에서</span> <span>내 그림을 뽐내보세요!</span>
            </p>
          </div>

          <div className={styles.buttons}>
            <SolidButton
              size="large"
              iconLeft={<Icon name="kakaotalk" size={24} />}
              onClick={handleKaKaoLogin}
              disabled={isPending}
              className={`${styles.oauthBtn} ${styles.kakao}`}
            >
              {isPending ? "로그인 중..." : "카카오로 계속하기"}
            </SolidButton>
            <SolidButton
              size="large"
              iconLeft={<Icon name="google" size={24} />}
              onClick={() => googleLogin()}
              disabled={isPending}
              className={`${styles.oauthBtn} ${styles.google}`}
            >
              {isPending ? "로그인 중..." : "구글로 계속하기"}
            </SolidButton>
            <OutlinedButton
              size="large"
              iconLeft={<Icon name="apple" size={24} color="base" />}
              onClick={handleAppleLogin}
              disabled={isPending}
              className={`${styles.oauthBtn} ${styles.apple}`}
            >
              {isPending ? "로그인 중..." : "애플로 계속하기"}
            </OutlinedButton>
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
              onClick={() =>
                window.open("https://open.kakao.com/o/sKYFewgh", "_blank", "noopener,noreferrer")
              }
              className={styles.footerBtn}
            >
              문의
            </TextButton>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <Link href="https://term.grimity.com/term" target="_blank" rel="noopener noreferrer">
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
