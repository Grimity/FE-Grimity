import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Layout from "@/components/Layout/Layout";
import Modal from "@/components/Modal/Modal";
import ToastContainer from "@/components/common/PopUp/Toast/ToastContainer";
import GlobalLoading from "@/components/common/Loading/GlobalLoading/GlobalLoading";
import ModalProvider from "@/components/Modal/Provider";

import { useInitializeDevice } from "@/hooks/useInitializeDevice";
import { useNavigationTracker } from "@/hooks/useNavigationTracker";
import { useThemeInit } from "@/hooks/useTheme";

import "@/styles/tokens/colors/_root.scss";
import "@/styles/globals.scss";
import "@/styles/reset.scss";
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/navigation";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useInitializeDevice();
  useNavigationTracker();
  useThemeInit();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, 
            user-scalable=0"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <div className="body">
            <ModalProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </div>
          <Modal />
          <ToastContainer target="global" />
          <GlobalLoading />
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
                gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                  send_page_view: false
                });
              `,
            }}
          />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </>
  );
}
