import { useRouter } from "next/router";

import UserItem from "@/components/common/Cell/UserItem/UserItem";
import { timeAgo } from "@/utils/timeAgo";
import { deleteNotificationsId } from "@/api/notifications/deleteNotifications";
import { putNotificationsId } from "@/api/notifications/putNotifications";

import { NotiProps } from "./Noti.types";

// TODO(codegen): 서버 알림 응답에 type 필드가 추가되면 문자열 추론을 제거한다.
function getNotificationCategory(message: string): string {
  if (message.includes("팔로우")) return "팔로우";
  if (message.includes("좋아요")) return "좋아요";
  if (message.includes("대댓글")) return "새 대댓글";
  if (message.includes("댓글")) return "새 댓글";
  return "알림";
}

export default function Noti({ notification, onClose, onRefetch }: NotiProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteNotificationsId(notification.id);
      onRefetch();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await putNotificationsId(notification.id);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
    router.push(notification.link);
    onClose();
  };

  return (
    <UserItem
      type="notification"
      category={getNotificationCategory(notification.message)}
      message={notification.message}
      time={timeAgo(notification.createdAt)}
      read={notification.isRead}
      onClick={handleClick}
      onClose={handleDelete}
    />
  );
}
