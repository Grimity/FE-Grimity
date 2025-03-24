import styles from "./Like.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "@/states/modalState";
import { useFeedsLike } from "@/api/feeds/getFeedsIdLike";
import Loader from "@/components/Layout/Loader/Loader";
import { isMobileState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Like() {
  const [, setModal] = useRecoilState(modalState);
  const route = useRouter();
  const { data, isLoading } = useFeedsLike({ id: String(route.query.id) });
  const isMobile = useRecoilValue(isMobileState);
  useIsMobile();

  const handleClickUser = (url: string) => {
    route.push(`${url}`);
    setModal({ isOpen: false, type: null, data: null });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>좋아요</div>
      <div className={styles.content}>
        <ul>
          {!data || data.length === 0 ? (
            <p className={styles.noData}>아직 좋아요가 없어요</p>
          ) : (
            data.map((like, index) => (
              <li key={index} className={styles.item}>
                {like.image !== "https://image.grimity.com/null" ? (
                  <Image
                    src={like.image}
                    width={isMobile ? 40 : 50}
                    height={isMobile ? 40 : 50}
                    quality={50}
                    onClick={() => handleClickUser(like.id)}
                    className={styles.image}
                    alt="프로필 이미지"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/image/default.svg"
                    width={isMobile ? 40 : 50}
                    height={isMobile ? 40 : 50}
                    quality={50}
                    onClick={() => handleClickUser(like.id)}
                    className={styles.image}
                    alt="프로필 이미지"
                    unoptimized
                  />
                )}
                {like.description !== "" ? (
                  <div className={styles.nameDescription} onClick={() => handleClickUser(like.url)}>
                    <p className={styles.name}>{like.name}</p>
                    <p className={styles.description}>{like.description}</p>
                  </div>
                ) : (
                  <div className={styles.nameContainer} onClick={() => handleClickUser(like.url)}>
                    <p className={styles.name}>{like.name}</p>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
