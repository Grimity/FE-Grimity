export type BottomNavTab = "home" | "rank" | "following" | "board" | "dm";

export interface BottomNavigationProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  /** DM 탭에 Push Badge 표시 여부 */
  hasDmBadge?: boolean;
  /** Plus 버튼 표시 여부 */
  showPlus?: boolean;
  /** Plus 버튼 클릭 핸들러 */
  onPlusClick?: () => void;
  className?: string;
}
