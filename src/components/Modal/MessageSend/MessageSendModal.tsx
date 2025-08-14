import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { useUserSearch } from "@/api/users/getUsersSearch";
import { usePostChat } from "@/api/chats/postChat";

import { useDebounce } from "@/hooks/useDebounce";

import Icon from "@/components/Asset/IconTemp";
import SearchBar from "@/components/SearchBar/SearchBar";

import styles from "./MessageSendModal.module.scss";

interface MessageSendModalProps {
  onClose: () => void;
}

interface SearchedUser {
  id: string;
  name: string;
  image: string | null;
  url: string;
}

const MessageSendModal = ({ onClose }: MessageSendModalProps) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const { data: searchResults, isLoading } = useUserSearch({
    keyword: debouncedKeyword,
    size: 20,
  });

  const { mutate: createChat } = usePostChat();

  const users = useMemo(() => {
    if (!searchResults?.pages) return [];
    return searchResults.pages.flatMap((page) => page.users || []);
  }, [searchResults]);

  const handleUserSelect = useCallback(
    (targetUserId: string) => {
      createChat(
        { targetUserId },
        {
          onSuccess: (data) => {
            onClose();
            router.push(`/direct/${data.id}`);
          },
          onError: (error) => {
            console.error("채팅방 생성 실패:", error);
          },
        },
      );
    },
    [createChat, onClose, router],
  );

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>메세지 보내기</h2>
        <button className={styles.closeButton} onClick={onClose}>
          <Icon icon="close" />
        </button>
      </div>

      <div className={styles.searchSection}>
        <SearchBar
          searchValue={searchKeyword}
          setSearchValue={setSearchKeyword}
          placeholder="누구에게 메시지를 보낼까요?"
          onSearch={() => {}}
        />
      </div>

      <div className={styles.userList}>
        {isLoading && debouncedKeyword && (
          <div className={styles.loading}>
            <p>검색 중...</p>
          </div>
        )}
        {!isLoading && debouncedKeyword && users.length === 0 && (
          <div className={styles.empty}>
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
        {!debouncedKeyword && (
          <div className={styles.empty}>
            <p>검색어를 입력해 사용자를 찾아보세요</p>
          </div>
        )}

        {users.map((user: SearchedUser) => (
          <div key={user.id} className={styles.userItem} onClick={() => handleUserSelect(user.id)}>
            <div className={styles.userAvatar}>
              <img
                src={user.image || "/image/default.svg"}
                alt={`${user.name} 프로필`}
                width={40}
                height={40}
              />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.nickname}>{user.name}</span>
              <span className={styles.url}>@{user.url}</span>
            </div>
            <div className={styles.deliveryIcon}>
              <Icon icon="deliver" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSendModal;
