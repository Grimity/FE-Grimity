import { useEffect, useState } from "react";

import { getSubscribe, putSubscribe, SubscriptionType } from "@/api/users/subscribe";
import { useGetNotifications } from "@/api/notifications/getNotifications";
import { deleteNotifications } from "@/api/notifications/deleteNotifications";
import { putNotifications } from "@/api/notifications/putNotifications";
import { useDeviceStore } from "@/states/deviceStore";

import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import Divider from "@/components/common/Divider/Divider";
import Empty from "@/components/common/Empty/Empty";
import ControlItem from "@/components/common/Cell/ControlItem/ControlItem";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import GNB from "@/components/common/Navigation/GNB/GNB";
import Noti from "@/components/Notifications/Noti/Noti";

import type { NotificationsProps } from "./Notifications.types";
import styles from "./Notifications.module.scss";

type NotificationsView = "list" | "settings";

const ALL_SUBSCRIPTION_TYPES: SubscriptionType[] = [
  "FOLLOW",
  "FEED_LIKE",
  "FEED_COMMENT",
  "FEED_REPLY",
  "POST_COMMENT",
  "POST_REPLY",
];

interface SettingsOption {
  type: SubscriptionType;
  label: string;
}

const FEED_OPTIONS: SettingsOption[] = [
  { type: "FEED_LIKE", label: "좋아요 알림" },
  { type: "FEED_COMMENT", label: "새 댓글 알림" },
  { type: "FEED_REPLY", label: "새 답글 알림" },
];

const POST_OPTIONS: SettingsOption[] = [
  { type: "POST_COMMENT", label: "새 댓글 알림" },
  { type: "POST_REPLY", label: "새 답글 알림" },
];

export default function Notifications({ onClose }: NotificationsProps) {
  const { data = [], refetch } = useGetNotifications();
  const { isMobile } = useDeviceStore();
  const [view, setView] = useState<NotificationsView>("list");
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscribe();
        setSubscriptions(response.subscription);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  const isAllEnabled = subscriptions.length === ALL_SUBSCRIPTION_TYPES.length;

  const handleToggleSubscription = async (type: SubscriptionType, isSubscribed: boolean) => {
    try {
      await putSubscribe({ type: isSubscribed ? "ALL" : type });
      setSubscriptions((prev) =>
        isSubscribed ? prev.filter((sub) => sub !== type) : [...prev, type],
      );
    } catch (error) {
      console.error("Failed to toggle subscription:", error);
    }
  };

  const handleToggleAll = async () => {
    try {
      await putSubscribe({ type: "ALL" });
      setSubscriptions(isAllEnabled ? [] : [...ALL_SUBSCRIPTION_TYPES]);
    } catch (error) {
      console.error("Failed to toggle all subscriptions:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await putNotifications();
      refetch();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteNotifications();
      refetch();
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
  };

  const sortedNotifications = [...data]
    .sort((a, b) => {
      if (a.isRead === b.isRead) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isRead ? 1 : -1;
    })
    .slice(0, 50);

  const hasNotifications = data.length > 0;

  const renderControlItem = (type: SubscriptionType, label: string) => (
    <ControlItem
      key={type}
      type="toggle"
      text={label}
      active={subscriptions.includes(type)}
      onClick={() => handleToggleSubscription(type, subscriptions.includes(type))}
    />
  );

  // ----- 공유 콘텐츠 -----
  const actionsRow = (
    <div className={styles.actions}>
      <TextButton
        variant="assistive"
        size="regular"
        iconRight={<Icon name="eye" size={16} color={!hasNotifications ? "gray-subtler" : "gray-normal"} />}
        onClick={handleMarkAllAsRead}
        disabled={!hasNotifications}
      >
        전체 읽음
      </TextButton>
      <span className={styles.actionsDivider}>
        <Divider size="vertical" variant="primary" />
      </span>
      <TextButton
        variant="assistive"
        size="regular"
        iconRight={<Icon name="trash-bin-trash" size={16} color={!hasNotifications ? "gray-subtler" : "gray-normal"} />}
        onClick={handleDeleteAllNotifications}
        disabled={!hasNotifications}
      >
        전체 삭제
      </TextButton>
    </div>
  );

  const listBody = hasNotifications ? (
    <div className={styles.list}>
      {sortedNotifications.map((notification, index) => (
        <div key={notification.id} className={styles.item}>
          <Noti notification={notification} onClose={onClose} onRefetch={refetch} />
          {index < sortedNotifications.length - 1 && <Divider variant="secondary" />}
        </div>
      ))}
    </div>
  ) : (
    <div className={styles.emptyWrap}>
      <Empty
        size="md"
        iconName="illust-alarm"
        title="새로운 알림이 없어요"
        content="내 글의 댓글과 좋아요, 다른 작가의 활동 등 새로운 소식을 알려드려요"
      />
    </div>
  );

  // ===========================================================
  // 모바일: 전체화면 + GNB(three-button) 헤더
  // ===========================================================
  if (isMobile) {
    if (view === "settings") {
      return (
        <div className={styles.mobileFill} role="dialog" aria-modal="true" aria-label="알림 설정">
          <GNB variant="three-button" title="알림 설정" onBack={() => setView("list")} />
          <div className={styles.mobileBody}>
            <div className={styles.mobileSettings}>
              <div className={styles.mobileControlRow}>
                <ControlItem
                  type="toggle"
                  text="모든 알림"
                  active={isAllEnabled}
                  onClick={handleToggleAll}
                />
              </div>
              <div className={styles.mobileControlRow}>
                {renderControlItem("FOLLOW", "팔로우 알림")}
              </div>

              <ListItem type="section" text="그림" />
              {FEED_OPTIONS.map(({ type, label }) => (
                <div key={type} className={styles.mobileControlRow}>
                  {renderControlItem(type, label)}
                </div>
              ))}

              <ListItem type="section" text="자유게시판" />
              {POST_OPTIONS.map(({ type, label }) => (
                <div key={type} className={styles.mobileControlRow}>
                  {renderControlItem(type, label)}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.mobileFill} role="dialog" aria-modal="true" aria-label="알림">
        <GNB
          variant="three-button"
          title="알림"
          onBack={onClose}
          rightActions={[
            <IconButton
              key="settings"
              variant="sm"
              icon={<Icon name="settings" size={24} color="gray-bold" />}
              onClick={() => setView("settings")}
              aria-label="알림 설정"
            />,
          ]}
        />
        <div className={styles.mobileBody}>
          {actionsRow}
          {listBody}
        </div>
      </div>
    );
  }

  // ===========================================================
  // 데스크톱: 플로팅 패널
  // ===========================================================
  if (view === "settings") {
    return (
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="알림 설정">
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <IconButton
              variant="sm"
              icon={<Icon name="chevron-left" size={24} color="gray-bold" />}
              onClick={() => setView("list")}
              aria-label="뒤로가기"
            />
            <h2 className={styles.title}>알림 설정</h2>
          </div>
          <IconButton
            variant="sm"
            icon={<Icon name="x" size={24} color="gray-bold" />}
            onClick={onClose}
            aria-label="닫기"
          />
        </header>

        <div className={styles.body}>
          <div className={styles.settings}>
            <ControlItem
              type="toggle"
              text="모든 알림"
              active={isAllEnabled}
              onClick={handleToggleAll}
            />
            <Divider variant="secondary" />
            {renderControlItem("FOLLOW", "팔로우 알림")}

            <section className={styles.settingsSection}>
              <h3 className={styles.sectionTitle}>그림</h3>
              {FEED_OPTIONS.map(({ type, label }) => renderControlItem(type, label))}
            </section>

            <section className={styles.settingsSection}>
              <h3 className={styles.sectionTitle}>자유게시판</h3>
              {POST_OPTIONS.map(({ type, label }) => renderControlItem(type, label))}
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel} role="dialog" aria-modal="true" aria-label="알림">
      <header className={styles.header}>
        <h2 className={styles.title}>알림</h2>
        <div className={styles.headerActions}>
          <IconButton
            variant="sm"
            icon={<Icon name="settings" size={24} color="gray-bold" />}
            onClick={() => setView("settings")}
            aria-label="알림 설정"
          />
          <IconButton
            variant="sm"
            icon={<Icon name="x" size={24} color="gray-bold" />}
            onClick={onClose}
            aria-label="닫기"
          />
        </div>
      </header>

      {actionsRow}

      <div className={styles.body}>{listBody}</div>
    </div>
  );
}
