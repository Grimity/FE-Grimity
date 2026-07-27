import { useEffect } from "react";

import { useThemeStore, ThemeMode } from "@/states/themeStore";

export type { ThemeMode };

/**
 * 앱 마운트 시 한 번만 호출하여 테마 스토어를 초기화한다. (_app.tsx)
 */
export function useThemeInit() {
  useEffect(() => useThemeStore.getState().initialize(), []);
}

/**
 * 테마 모드를 읽고 변경하는 셀렉터 훅. (ThemeSettings 등 소비자)
 */
export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  return { mode, setMode };
}
