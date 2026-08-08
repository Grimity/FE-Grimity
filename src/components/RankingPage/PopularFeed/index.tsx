import { useRouter } from "next/router";

import { subWeeks } from "date-fns";

import DatePicker from "@/components/common/DatePicker";
import Album from "@/components/common/Card/Album/Album";
import Tab from "@/components/common/SegmentedControl/Tab/Tab";

import { useRankings } from "@/api/feeds/getRankings";
import { useAuthStore } from "@/states/authStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";

import { DatePickerMode } from "@/components/common/DatePicker/DatePicker.types";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/RankingPage/PopularFeed/PopularFeed.module.scss";

export default function PopularFeed() {
  const router = useRouter();
  const { query } = router;

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { mutate: toggleLike } = useFeedsLikeMutation();

  const mode = (query.mode as DatePickerMode) || DatePickerMode.WEEK;
  const date = (query.date as string) ? new Date(query.date as string) : new Date();

  const { data } = useRankings({
    ...(mode === DatePickerMode.MONTH && { month: formattedDate(date, "yyyy-MM") }),
    startDate: formattedDate(subWeeks(date, 1), "yyyy-MM-dd"),
    endDate: formattedDate(date, "yyyy-MM-dd"),
  });

  const handleTabChange = (newMode: DatePickerMode) => {
    router.replace({
      pathname: router.pathname,
      query: {
        mode: newMode,
      },
    });
  };

  const handleDateChange = (newDate: Date) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...query,
        date: formattedDate(newDate, "yyyy-MM-dd"),
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>인기 그림 순위</h2>
        <p className={styles.description}>랭킹 40위까지 노출됩니다.</p>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="랭킹 기간">
        <Tab
          title="주간"
          showNumber={false}
          active={mode === DatePickerMode.WEEK}
          onClick={() => handleTabChange(DatePickerMode.WEEK)}
        />
        <Tab
          title="월간"
          showNumber={false}
          active={mode === DatePickerMode.MONTH}
          onClick={() => handleTabChange(DatePickerMode.MONTH)}
        />
      </div>

      <div className={styles.datePickerContainer}>
        <DatePicker mode={mode} selectedDate={date} onDateChange={handleDateChange} />
      </div>

      <section className={styles.feedContainer}>
        {data?.feeds.map((feed) => {
          const isLiked = feed.isLike ?? false;
          const authorUrl = feed.author?.url;

          return (
            <Album
              key={feed.id}
              variant="mainTitle"
              imageUrl={feed.thumbnail}
              title={feed.title}
              nickname={feed.author?.name ?? ""}
              likeCount={feed.likeCount}
              viewCount={feed.viewCount}
              isLiked={isLoggedIn ? isLiked : undefined}
              feedHref={`/feeds/${feed.id}`}
              profileHref={authorUrl ? `/${authorUrl}` : undefined}
              authorUrl={authorUrl ?? undefined}
              onLikeClick={isLoggedIn ? () => toggleLike({ id: feed.id, isLiked }) : undefined}
            />
          );
        })}
      </section>
    </div>
  );
}
