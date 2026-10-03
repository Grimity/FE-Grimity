import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";

export type ProfileTab = "feeds" | "posts";

const isProfileTab = (value: unknown): value is ProfileTab =>
  value === "feeds" || value === "posts";

/**
 * 탭 상태를 URL의 tab 쿼리와 동기화한다.
 */
export function useProfileTab() {
  const router = useRouter();
  const { query } = router;

  const activeTab: ProfileTab = isProfileTab(query.tab) ? query.tab : "feeds";

  const changeTab = (tab: ProfileTab) => {
    // 탭을 옮기면 이전 탭의 페이지 번호는 버린다
    const nextQuery: ParsedUrlQuery = { ...query, tab };
    delete nextQuery.page;

    router.push({ query: nextQuery }, undefined, { shallow: true });
  };

  return { activeTab, changeTab };
}
