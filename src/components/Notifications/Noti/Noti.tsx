import IconComponent from "@/components/Asset/Icon";
import styles from "./Noti.module.scss";
import { NotiProps } from "./Noti.types";
import { timeAgo } from "@/utils/timeAgo";
import { deleteNotificationsId } from "@/api/notifications/deleteNotifications";
import Image from "next/image";
import { putNotificationsId } from "@/api/notifications/putNotifications";
import { useToast } from "@/hooks/useToast";
import axios from "axios";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { isTabletState } from "@/states/isMobileState";
import axiosInstance from "@/constants/baseurl";

// TODO: 여기는 npm type 공유해놓은게 인식이 안되서 잠깐 보류
export default function Noti({ notification, onClose, onRefetch }: NotiProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const isTablet = useRecoilValue(isTabletState);

  const renderMessage = () => {
    switch (notification.data.type) {
      case "FOLLOW":
        return `${notification.data.actor.name}님이 나를 팔로우했어요.`;
      case "FEED_LIKE":
        return `${notification.data.title}에 좋아요가 ${notification.data.likeCount}개 달렸어요.`;
      case "FEED_COMMENT":
        return `${notification.data.actor.name}님이 내 그림에 댓글을 달았어요.`;
      case "FEED_REPLY":
        return `${notification.data.actor.name}님이 내 댓글에 답글을 달았어요.`;
      case "FEED_MENTION":
        return `${notification.data.actor.name}님이 내 답글에 답글을 달았어요.`;
      case "POST_COMMENT":
        return `${notification.data.actor.name}님이 내 게시글에 댓글을 달았어요.`;
      case "POST_REPLY":
        return `${notification.data.actor.name}님이 내 댓글에 답글을 달았어요.`;
      case "POST_MENTION":
        return `${notification.data.actor.name}님이 내 답글에 답글을 달았어요.`;

      default:
        return "";
    }
  };

  const renderImage = () => {
    if (notification.data.type === "FEED_LIKE") {
      return (
        <img
          src={`https://image.grimity.com/${notification.data.thumbnail}`}
          width={isTablet ? 32 : 40}
          height={isTablet ? 32 : 40}
          loading="lazy"
          alt="Thumbnail Image"
          className={styles.thumbnail}
        />
      );
    } else {
      return (
        <Image
          src={
            notification.data.actor.image
              ? `https://image.grimity.com/${notification.data.actor.image}`
              : "/image/default.svg"
          }
          width={isTablet ? 32 : 40}
          height={isTablet ? 32 : 40}
          quality={50}
          alt="Actor Image"
          className={styles.actorImage}
          unoptimized
        />
      );
    }
  };

  const renderId = () => {
    switch (notification.data.type) {
      case "FOLLOW":
        return `${notification.data.actor.url}`;
      case "FEED_LIKE":
      case "FEED_COMMENT":
      case "FEED_REPLY":
      case "FEED_MENTION":
        return `/feeds/${notification.data.feedId}`;
      case "POST_COMMENT":
      case "POST_REPLY":
      case "POST_MENTION":
        return `/posts/${notification.data.postId}`;
      default:
        return "";
    }
  };

  const handleDeleteNotification = async () => {
    try {
      await deleteNotificationsId(notification.id);
      onRefetch();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleReadNotification = async () => {
    try {
      await putNotificationsId(notification.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleNotificationClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await axiosInstance.head(`${renderId()}`);
      await handleReadNotification();
      router.push(renderId());
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        if (notification.data.type === "FOLLOW") {
          showToast("탈퇴한 회원입니다.", "warning");
        } else {
          showToast("삭제된 게시물입니다.", "warning");
        }
        try {
          await handleDeleteNotification();
          onRefetch();
        } catch (deleteError) {
          console.error("알림 삭제 실패:", deleteError);
        }
      }
    } finally {
      onClose();
    }
  };

  return (
    <div className={`${styles.container} ${notification.isRead ? styles.read : ""}`}>
      <div className={styles.content} onClick={handleNotificationClick}>
        {renderImage()}
        <div className={styles.messageWrapper}>
          <span className={styles.message}>{renderMessage()}</span>
          <span className={styles.date}>{timeAgo(notification.createdAt)}</span>
        </div>
      </div>
      <div onClick={handleDeleteNotification}>
        <IconComponent name="notiDelete" size={24} isBtn padding={8} />
      </div>
    </div>
  );
}
