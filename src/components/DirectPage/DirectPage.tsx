import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { useChatStore } from "@/states/chatStore";

import DMHeader from "@/components/DirectPage/DMHeader/DMHeader";
import DMControls from "@/components/DirectPage/DMControls/DMControls";
import ChatList from "@/components/DirectPage/ChatList/ChatList";
import ChatListSkeleton from "@/components/DirectPage/ChatListSkeleton/ChatListSkeleton";
import EmptyState from "@/components/DirectPage/EmptyState/EmptyState";
import MessageSendModal from "@/components/Modal/MessageSend/MessageSendModal";

import { useGetChatsInfinite } from "@/api/chats/getChats";

import { useModal } from "@/hooks/useModal";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import styles from "./DirectPage.module.scss";

const DirectPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);

  const { openModal } = useModal();
  const { markAsRead } = useChatStore();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetChatsInfinite({
    keyword: searchValue,
    size: 20,
  });

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: hasNextPage || false,
    isFetching: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  const chatList = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.chats || []);
  }, [data]);

  const isAllSelected = chatList.length > 0 && selectedChatIds.length === chatList.length;

  useEffect(() => {
    if (!isEditMode) {
      setSelectedChatIds([]);
    }
  }, [isEditMode]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const handleSearch = useCallback((value?: string) => {
    setSearchValue(value);
  }, []);

  const handleEditMode = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const handleCloseEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const handleToggleSelect = useCallback((chatId: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId],
    );
  }, []);

  const handleChatClick = useCallback(
    (chatId: string) => {
      if (isEditMode) {
        handleToggleSelect(chatId);
        return;
      }
      router.push(`/direct/${chatId}`);
    },
    [isEditMode, router, handleToggleSelect],
  );

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedChatIds([]);
    } else {
      setSelectedChatIds(chatList.map((chat) => chat.id));
    }
  }, [isAllSelected, chatList]);

  const handleNewMessage = () => {
    openModal((close) => <MessageSendModal onClose={close} />);
  };

  if (isLoading) {
    return (
      <section className={styles.container}>
        <DMHeader
          isEditMode={isEditMode}
          onSearch={handleSearch}
          onEditMode={handleEditMode}
          onNewMessage={handleNewMessage}
          onCloseEditMode={handleCloseEditMode}
        />
        <ChatListSkeleton count={5} />
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <DMHeader
        isChatEmpty={!chatList.length}
        isEditMode={isEditMode}
        searchKeyword={searchValue}
        onSearch={handleSearch}
        onEditMode={handleEditMode}
        onNewMessage={handleNewMessage}
        onCloseEditMode={handleCloseEditMode}
      />

      {chatList.length === 0 ? (
        <EmptyState onNewMessage={handleNewMessage} />
      ) : (
        <div className={styles.chatContainer}>
          <div className={`${styles.controls} ${isEditMode ? styles.editModeControls : ""}`}>
            <DMControls
              isEditMode={isEditMode}
              isAllSelected={isAllSelected}
              selectedChatIds={selectedChatIds}
              onEditMode={handleEditMode}
              onCloseEditMode={handleCloseEditMode}
              onSelectAll={handleSelectAll}
            />
          </div>

          <ChatList
            chatList={chatList}
            isEditMode={isEditMode}
            selectedChatIds={selectedChatIds}
            searchKeyword={searchValue}
            onChatClick={handleChatClick}
            onToggleSelect={handleToggleSelect}
          />

          {hasNextPage && <div ref={loadMoreRef} className={styles.loadMore} />}

          {isFetchingNextPage && <ChatListSkeleton count={3} />}
        </div>
      )}
    </section>
  );
};

export default DirectPage;
