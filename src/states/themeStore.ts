import { create } from "zustand";

type Theme = "light" | "dark";
export type ThemeMode = "system" | "light" | "dark";

const THEME_KEY = "theme";

// HOTFIX: 다크 토큰이 전 페이지에 적용될 때까지 다크모드를 잠근다.
// 준비되면 true 로 바꾸면 저장된 사용자 설정/시스템 테마가 그대로 복원된다.
const DARK_MODE_ENABLED = false;

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyDataTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

interface ThemeStore {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /**
   * localStorage 를 읽어 초기 테마를 적용하고 prefers-color-scheme 변화를 구독한다.
   * 앱 전체에서 한 번만 호출되어야 하며, 구독 해제 함수를 반환한다.
   */
  initialize: () => () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  mode: "system",

  setMode: (mode) => {
    if (mode === "system") {
      try {
        localStorage.removeItem(THEME_KEY);
      } catch {}
      const theme = getSystemTheme();
      applyDataTheme(theme);
      set({ mode, theme });
    } else {
      try {
        localStorage.setItem(THEME_KEY, mode);
      } catch {}
      applyDataTheme(mode);
      set({ mode, theme: mode });
    }
  },

  initialize: () => {
    if (!DARK_MODE_ENABLED) {
      applyDataTheme("light");
      set({ mode: "light", theme: "light" });
      return () => {};
    }

    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch {}

    const initialMode: ThemeMode = stored === "light" || stored === "dark" ? stored : "system";
    const initialTheme = initialMode === "system" ? getSystemTheme() : initialMode;
    applyDataTheme(initialTheme);
    set({ mode: initialMode, theme: initialTheme });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      let hasManualOverride = false;
      try {
        const s = localStorage.getItem(THEME_KEY);
        hasManualOverride = s === "light" || s === "dark";
      } catch {}
      if (!hasManualOverride) {
        const next: Theme = e.matches ? "dark" : "light";
        applyDataTheme(next);
        set({ theme: next });
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  },
}));
