import { getSSRUserInfoByUrl, UserMetaResponse } from "@/api/users/getId";
import { useMyData } from "@/api/users/getMe";
import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { DEFAULT_THUMBNAIL } from "@/constants/imageUrl";

type Props = {
  data: UserMetaResponse;
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

export default function Profile({ data }: Props) {
  const { data: myData } = useMyData();
  useScrollRestoration("profile-scroll");

  const loggedInUserUrl = myData?.url; // Be sure this is the correct field
  const isMyProfile = data.url === loggedInUserUrl;

  // url is guaranteed to be a string here due to getServerSideProps
  return (
    <>
      <Head>
        <title>{`${data.name}의 프로필 - 그리미티`}</title>
        <meta name="keywords" content="그리미티, grimity" />
        <meta name="description" content={data.description ?? ""} />
        <meta property="og:title" content={`${data.name} - 그리미티`} />
        <meta property="og:description" content={`${data.description} | grimity |`} />
        <meta property="og:image" content={data.image ?? DEFAULT_THUMBNAIL} />
        <meta property="og:url" content={`${serviceUrl}/${data.url}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.name}의 프로필 - 그리미티`} />
        <meta name="twitter:description" content={data.description ?? ""} />
        <meta name="twitter:image" content={data.image ?? DEFAULT_THUMBNAIL} />
      </Head>
      <ProfilePage isMyProfile={isMyProfile} id={data.id} url={data.url} />
    </>
  );
}
