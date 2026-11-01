import { getSSRDetails, FeedMetaResponse } from "@/api/feeds/getFeedsId";
import Detail from "@/components/Detail/Detail";
import { DEFAULT_THUMBNAIL } from "@/constants/imageUrl";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  details: FeedMetaResponse;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const details = await getSSRDetails(id);

    return {
      props: { details },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function FeedDetail({ details }: Props) {
  const router = useRouter();
  useScrollRestoration("details-scroll");

  const { id } = router.query;

  if (!id) {
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
        <meta property="og:image" content={details.thumbnail ?? DEFAULT_THUMBNAIL} />
        <meta property="og:url" content={`${serviceUrl}/feeds/${details.id}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${details.title} - 그리미티`} />
        <meta name="twitter:description" content={details.content ?? "grimity"} />
        <meta name="twitter:image" content={details.thumbnail ?? DEFAULT_THUMBNAIL} />
      </Head>
      <Detail id={id as string} />
    </>
  );
}
