import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface NavigationPageProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  page: number;
  active?: boolean;
}

export interface NavigationIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  active?: boolean;
}

export interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  maxVisiblePages?: number;
  className?: string;
}
