import type { HTMLAttributes } from "react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

export type GroupSettingsState =
  | "enabled"
  | "pressed"
  | "delete"
  | "editDelete"
  | "disabled";

export interface GroupSettingsProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  state?: GroupSettingsState;
  isDragging?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  onDelete?: () => void;
  className?: string;
}
