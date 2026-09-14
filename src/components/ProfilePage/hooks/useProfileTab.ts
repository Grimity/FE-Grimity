import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

export type ProfileTab = "feeds" | "posts";

const isProfileTab = (value: unknown): value is ProfileTab =>
  value === "feeds" || value === "posts";

/**
 * 탭 상태를 URL의 tab 쿼리와 동기화한다.
 * 글 탭은 내 프로필에서만 열 수 있고, 남의 프로필이면 그림 탭으로 되돌린다.
 */
export function useProfileTab(isMyProfile: boolean) {
  const router = useRouter();
  const { query } = router;

  const [activeTab, setActiveTab] = useState<ProfileTab>(
    isProfileTab(query.tab) ? query.tab : "feeds",
  );

  useEffect(() => {
    if (!isProfileTab(query.tab)) return;

    if (query.tab === "posts" && !isMyProfile) {
      setActiveTab("feeds");
      router.push({ query: { ...query, tab: "feeds" } }, undefined, { shallow: true });
      return;
    }

    setActiveTab(query.tab);
  }, [query.tab, isMyProfile]);

  const changeTab = (tab: ProfileTab) => {
    if (tab === "posts" && !isMyProfile) return;

    setActiveTab(tab);

    // 탭을 옮기면 이전 탭의 페이지 번호는 버린다
    const nextQuery: ParsedUrlQuery = { ...query, tab };
    delete nextQuery.page;

    router.push({ query: nextQuery }, undefined, { shallow: true });
  };

  return { activeTab, changeTab };
}
