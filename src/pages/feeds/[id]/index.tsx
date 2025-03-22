import { getSSRDetails, MetaDetailsResponse } from "@/api/feeds/getFeedsId";
import Detail from "@/components/Detail/Detail";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  details: MetaDetailsResponse;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { url } = context.params as { url: string };

  try {
    const details = await getSSRDetails(url);

    return {
      props: { details },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function FeedDetail({ details }: Props) {
  const router = useRouter();
  const { restoreScrollPosition } = useScrollRestoration("details-scroll");

  useEffect(() => {
    if (sessionStorage.getItem("details-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("details-scroll");
    }
  }, []);

  const { url } = router.query;

  if (!url) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${details.title} - 그리미티`}</title>
        <meta name="description" content={details.content ?? ""} />
        <meta name="keywords" content={`그리미티, grimity, ${details.tags}`} />
        <meta property="og:title" content={`${details.title} - 그리미티`} />
        <meta
          property="og:description"
          content={`${details.content} | grimity | ${details.tags}`}
        />
        <meta property="og:image" content={details.thumbnail ?? ""} />
        <meta property="og:url" content={`${serviceUrl}feeds/${details.id}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${details.title} - 그리미티`} />
        <meta name="twitter:description" content={details.content ?? ""} />
        <meta name="twitter:image" content={details.thumbnail ?? ""} />
      </Head>
      <Detail id={id as string} />
    </>
  );
}
