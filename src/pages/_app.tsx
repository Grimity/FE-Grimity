import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import "@/styles/globals.scss";
import "@/styles/reset.css";
import Layout from "@/components/Layout/Layout";
import Modal from "@/components/Modal/Modal";
import { useAuthStore } from "@/states/authStore";
import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Toast from "@/components/Toast/Toast";
import Script from "next/script";

const queryClient = new QueryClient();

function InitializeAuthState() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

    if (access_token) {
      setAccessToken(access_token);
      setIsLoggedIn(true);
      if (user_id) {
        setUserId(user_id);
      }
    }
    setIsInitialized(true);
  }, []);

  return null;
}

function PersistAuthState() {
  const access_token = useAuthStore((state) => state.access_token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("access_token", access_token);
      if (user_id) {
        localStorage.setItem("user_id", user_id);
      }
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    }
  }, [access_token, isLoggedIn, user_id]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <InitializeAuthState />
      <PersistAuthState />
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <div className="body">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
          <Modal />
          <Toast />
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
              `,
            }}
          />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </>
  );
}
