export type CounterSize = "lg" | "md";

export interface CounterProps {
  current: number;
  total: number;
  size?: CounterSize;
  className?: string;
}
