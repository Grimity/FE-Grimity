import FollowingPage from "@/components/FollowingPage/FollowingPage";
import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Following() {
  const router = useRouter();
  const [OGTitle] = useState("팔로잉 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  useScrollRestoration("following-scroll");

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  return (
    <AuthLayout>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <FollowingPage />
    </AuthLayout>
  );
}
