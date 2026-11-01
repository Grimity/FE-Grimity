import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { InitialPageMeta } from "@/components/MetaData/MetaData";
import Ranking from "@/components/RankingPage";

import { serviceUrl } from "@/constants/serviceurl";

import { useScrollRestoration } from "@/hooks/useScrollRestoration";

function RankingPage() {
  const router = useRouter();
  const [OGTitle] = useState("랭킹 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  useScrollRestoration("popular-scroll");

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Ranking />
    </>
  );
}

export default RankingPage;
