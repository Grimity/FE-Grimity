import { Html, Head, Main, NextScript } from "next/document";

import { CONFIG } from "@/config";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="google-adsense-account" content={CONFIG.MARKETING.ADSENSE_CLIENT_ID} />
        <link rel="icon" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicon/android-chrome-512x512.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <script defer src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
        <script defer src="https://accounts.google.com/gsi/client" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "그리미티",
              description: "그림쟁이들을 위한 그림 커뮤니티, 그리미티",
              url: "https://www.grimity.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "서울특별시",
                addressCountry: "KR",
              },
              image: "/favicon/android-chrome-192x192.png",
            }),
          }}
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.MARKETING.ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(d?'dark':'light'));}catch(e){}})();`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
