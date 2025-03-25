export interface TooltipProps {
  direction?: "up" | "down" | "left" | "right";
  trigger?: "hover" | "click";
  content: string;
  children: React.ReactNode;
}
