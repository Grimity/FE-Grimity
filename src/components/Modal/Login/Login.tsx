import Script from "next/script";
import { useRouter } from "next/router";

import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";

import postLogin, { AuthProvider } from "@/api/auth/postLogin";
import { useMyData } from "@/api/users/getMe";

import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";

import Icon from "@/components/Asset/IconTemp";
import IconComponent from "@/components/Asset/Icon";

import { useToast } from "@/hooks/useToast";
import { CONFIG } from "@/config";

import styles from "./Login.module.scss";

const SIGNUP_OAUTH_KEY = "signup_oauth_data";

interface LoginProps {
  close: () => void;
}

interface AuthObj {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
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

export default function Login({ close }: LoginProps) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
  const router = useRouter();
  const { showToast } = useToast();
  const { refetch: fetchMyData } = useMyData();
  const { setHasUnreadMessages } = useChatStore();

  const goToSignup = (accessToken: string, provider: AuthProvider) => {
    sessionStorage.setItem(
      SIGNUP_OAUTH_KEY,
      JSON.stringify({ accessToken, provider }),
    );
    close();
    router.push("/signup/nickname");
  };

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

      close();
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
            console.error("카카오 로그인 실패", error);
            showToast("로그인 실패", "error");
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
          console.error("구글 로그인 실패", error);
          showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
        }
      }
    },
    onError: () => {
      console.error("구글 로그인 실패");
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
        console.error("애플 로그인 실패", error);
        showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
      }
    }
  };

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
      <div className={styles.container}>
        <div className={styles.messageContainer}>
          <div className={styles.header}>
            <Icon icon="logo" className={styles.logo} />
            <button type="button" className={styles.closeButton} onClick={close}>
              <Icon icon="close" size="2xl" className={styles.close} />
            </button>
          </div>
          <p className={styles.text}>그리미티에 가입 후 나의 그림을 뽐내보세요</p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.kakao}`}
            onClick={handleKaKaoLogin}
            disabled={isPending}
          >
            <IconComponent name="kakao" size={24} />
            {isPending ? "로그인 중..." : "카카오로 계속하기"}
          </button>
          <button
            className={`${styles.button} ${styles.google}`}
            onClick={() => googleLogin()}
            disabled={isPending}
          >
            <IconComponent name="google" size={20} />
            {isPending ? "로그인 중..." : "구글로 계속하기"}
          </button>
          <button
            className={`${styles.button} ${styles.apple}`}
            onClick={handleAppleLogin}
            disabled={isPending}
          >
            <Icon icon="apple" className={styles.appleIcon} size="2xl" />
            {isPending ? "로그인 중..." : "애플로 계속하기"}
          </button>
        </div>
      </div>
    </>
  );
}
