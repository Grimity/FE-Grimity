import { NotificationResponse } from "@grimity/dto";

export interface NotiProps {
  notification: NotificationResponse;
  onClose: () => void;
  onRefetch: () => void;
}
