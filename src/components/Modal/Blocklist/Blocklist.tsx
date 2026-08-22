import { useDeviceStore } from "@/states/deviceStore";

import { useMeGetMyBlockings } from "@/api/generated/me/me";
import { useUserUnblock } from "@/api/generated/users/users";

import { useToast } from "@/hooks/useToast";

import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Empty from "@/components/common/Empty/Empty";

import styles from "./Blocklist.module.scss";

interface BlocklistProps {
  close: () => void;
}

export default function Blocklist({ close }: BlocklistProps) {
  const { isMobile } = useDeviceStore();
  const { data: blockingsData, refetch } = useMeGetMyBlockings();
  const { mutate: unblockUser } = useUserUnblock();
  const { showToast } = useToast();

  const handleUnblock = (userId: string, userName: string) => {
    unblockUser(
      { id: userId },
      {
        onSuccess: () => {
          showToast(`${userName}님을 차단 해제했습니다.`, "success");
          refetch();
        },
        onError: () => {
          showToast("차단 해제 중 오류가 발생했습니다.", "error");
        },
      },
    );
  };

  const users = blockingsData?.users ?? [];

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>차단 목록</h2>
          <IconButton
            variant="sm"
            icon={<Icon name="x" size={20} />}
            onClick={close}
            aria-label="닫기"
          />
        </div>
      )}
      <div className={styles.blocklistContainer}>
        {users.length === 0 ? (
          <Empty size="md" iconName="illust-user" title="차단한 작가가 없어요" />
        ) : (
          <ul className={styles.list}>
            {users.map((user) => (
              <li key={user.id}>
                <UserItem
                  type="id"
                  profileImage={user.image ?? undefined}
                  nickname={user.name}
                  userId={user.url}
                >
                  <OutlinedButton size="small" onClick={() => handleUnblock(user.id, user.name)}>
                    차단 해제
                  </OutlinedButton>
                </UserItem>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
