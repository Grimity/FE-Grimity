import { getSSRUserInfoByUrl, MetaUserInfoResponse } from "@/api/users/getId";
import { useMyData } from "@/api/users/getMe";
import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  data: MetaUserInfoResponse;
  url: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { url } = context.params as { url: string };

  try {
    const data = await getSSRUserInfoByUrl(url);
    return {
      props: { data, url },
    };
  } catch (error) {
    console.error("Error fetching user data:", error); // Log the error for debugging
    return { notFound: true };
  }
};

export default function Profile({ data, url }: Props) {
  const router = useRouter();
  const { data: myData } = useMyData();
  const { restoreScrollPosition } = useScrollRestoration("profile-scroll");

  useEffect(() => {
    if (sessionStorage.getItem("profile-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("profile-scroll");
    }
  }, []);

  const loggedInUserUrl = myData?.url; // Be sure this is the correct field
  const isMyProfile = url === loggedInUserUrl;

  // url is guaranteed to be a string here due to getServerSideProps
  return (
    <>
      <Head>
        <title>{`${data.name}의 프로필 - 그리미티`}</title>
        <meta name="keywords" content="그리미티, grimity" />
        <meta name="description" content={data.description ?? ""} />
        <meta property="og:title" content={`${data.name} - 그리미티`} />
        <meta property="og:description" content={`${data.description} | grimity |`} />
        <meta property="og:image" content={data.image ?? "/image/grimity_default.png"} />
        <meta property="og:url" content={`${serviceUrl}users/${data.id}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.name}의 프로필 - 그리미티`} />
        <meta name="twitter:description" content={data.description ?? ""} />
        <meta name="twitter:image" content={data.image ?? "/image/grimity_default.png"} />
      </Head>
      <ProfilePage isMyProfile={isMyProfile} id={data.id} url={url} />
    </>
  );
}
