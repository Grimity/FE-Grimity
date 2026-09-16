import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { useMyFollowing } from "@/api/users/getMeFollow";
import { usePostChat } from "@/api/chats/postChat";

import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDeviceStore } from "@/states/deviceStore";

import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import TextField from "@/components/common/Input/TextField/TextField";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Empty from "@/components/common/Empty/Empty";
import Loader from "@/components/Layout/Loader/Loader";

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
  const { isMobile } = useDeviceStore();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const {
    data: searchResults,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyFollowing({ keyword: debouncedKeyword, size: 20 });

  const { mutate: createChat } = usePostChat();

  const followingList = useMemo(
    () => searchResults?.pages.flatMap((page) => page.followings || []) ?? [],
    [searchResults],
  );

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetching: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

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

  const showLoading = isLoading;
  const isEmpty = !showLoading && followingList.length === 0;

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        {isMobile ? (
          <>
            <button
              type="button"
              className={styles.backButton}
              onClick={onClose}
              aria-label="뒤로가기"
            >
              <Icon name="chevron-left" size={24} color="gray-bold" />
            </button>
            <h2 className={styles.title}>새 메시지 보내기</h2>
          </>
        ) : (
          <>
            <h2 className={styles.title}>새 메시지 보내기</h2>
            <IconButton
              variant="sm"
              icon={<Icon name="x" size={24} color="gray-bold" />}
              onClick={onClose}
              aria-label="닫기"
            />
          </>
        )}
      </div>

      <div className={styles.content}>
        <TextField
          variant="search"
          size="md"
          className={styles.search}
          placeholder="누구에게 메시지를 보낼까요?"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onClear={() => setSearchKeyword("")}
        />

        {showLoading ? (
          <div className={styles.stateWrap}>
            <Loader />
          </div>
        ) : isEmpty ? (
          <div className={styles.stateWrap}>
            {debouncedKeyword ? (
              <Empty
                size="xl"
                iconName="illust-warning"
                title="일치하는 작가가 없어요"
                content="검색어의 단어 수를 줄이거나 다른 검색어로 검색해보세요."
              />
            ) : (
              <Empty
                size="xl"
                iconName="illust-user"
                title="팔로우 하는 작가가 없어요"
                content="관심 있는 작가를 팔로우하고 메세지를 주고받아 보세요"
              />
            )}
          </div>
        ) : (
          <div className={styles.list}>
            {followingList.map((user: SearchedUser) => (
              <UserItem
                key={user.id}
                type="id"
                className={styles.userCell}
                profileImage={user.image ?? undefined}
                nickname={user.name}
                userId={user.url}
                onClick={() => handleUserSelect(user.id)}
              >
                <Icon name="forward" size={24} color="gray-bold" className={styles.cellArrow} />
              </UserItem>
            ))}

            {hasNextPage && <div ref={loadMoreRef} className={styles.sentinel} />}
            {isFetchingNextPage && <Loader />}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSendModal;
