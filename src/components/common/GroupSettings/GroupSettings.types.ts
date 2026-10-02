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
  /** 지정하면 연필 아이콘이 클릭 가능한 버튼이 된다 */
  onEdit?: () => void;
  className?: string;
  /** 지정하면 title 텍스트 대신 렌더 (예: 편집 가능한 입력 필드) */
  children?: React.ReactNode;
}
