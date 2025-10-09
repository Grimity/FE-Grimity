import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./SearchPage.module.scss";
import { useTagsPopular } from "@/api/tags/getTagsPopular";
import Link from "next/link";
import SearchFeed from "./Feed/SearchFeed/SearchFeed";
import SearchAuthor from "./User/SearchAuthor/SearchAuthor";
import SearchPost from "./Post/SearchPost/SearchPost";
import { useDeviceStore } from "@/states/deviceStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const { data: popularData } = useTagsPopular();
  const router = useRouter();
  const { tab } = router.query;
  const { isMobile } = useDeviceStore();

  useEffect(() => {
    const keyword = router.query.keyword as string | undefined;
    if (keyword) {
      setSearchValue(keyword);
      setSearchKeyword(keyword);
    }
  }, [router.query.keyword]);

  const getTabComponent = () => {
    switch (tab) {
      case "feed":
        return <SearchFeed />;
      case "author":
        return <SearchAuthor />;
      case "board":
        return <SearchPost />;
      default:
        return null;
    }
  };

  const getTabClass = (tabName: string) => {
    return tab === tabName ? styles.selected : "";
  };

  const handleSearch = (value?: string) => {
    const currentTab = tab === "author" ? "author" : tab === "board" ? "board" : "feed";
    setSearchKeyword(value || "");
    router.push(`?tab=${currentTab}&keyword=${value}`, undefined, { shallow: true });
  };

  const handleClear = () => {
    setSearchKeyword("");
    router.push("", undefined, { shallow: true });
  };

  const renderChips = () => {
    if (!popularData?.length) return null;

    if (isMobile) {
      return (
        <Swiper
          modules={[FreeMode]}
          spaceBetween={8}
          slidesPerView="auto"
          freeMode={true}
          className={styles.swiperContainer}
        >
          {popularData.slice(0, 8).map((tag, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <Link href={`/search?tab=feed&keyword=${tag.tagName}`} className={styles.chipLink}>
                <div className={styles.chip}>{tag.tagName}</div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    return (
      <div className={styles.chips}>
        {popularData.slice(0, 8).map((tag, index) => (
          <Link
            href={`/search?tab=feed&keyword=${tag.tagName}`}
            key={index}
            className={styles.chipLink}
          >
            <div className={styles.chip}>{tag.tagName}</div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <section className={styles.searchBarSection}>
          <div className={styles.searchBarContainer}>
            <SearchBar
              searchValue={searchValue}
              placeholder="그림, 작가, 관련 작품을 검색해보세요"
              setSearchValue={setSearchValue}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </div>
          <div className={styles.recommend}>
            <p className={styles.recommendMessage}>추천 태그</p>
            {renderChips()}
          </div>
        </section>
        <section className={styles.navContainer}>
          <button
            className={`${styles.button} ${getTabClass("feed")}`}
            onClick={() => router.push(`?tab=feed&keyword=${searchKeyword}`)}
          >
            그림
          </button>
          <button
            className={`${styles.button} ${getTabClass("author")}`}
            onClick={() => router.push(`?tab=author&keyword=${searchKeyword}`)}
          >
            유저
          </button>
          <div className={styles.bar} />
          <button
            className={`${styles.button} ${getTabClass("board")}`}
            onClick={() => router.push(`?tab=board&keyword=${searchKeyword}`)}
          >
            자유게시판
          </button>
        </section>
        {getTabComponent()}
      </div>
    </div>
  );
}
