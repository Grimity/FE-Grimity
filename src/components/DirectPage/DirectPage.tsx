import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import DMHeader from "./DMHeader/DMHeader";
import DMControls from "./DMControls/DMControls";
import ChatList from "./ChatList/ChatList";
import Button from "@/components/Button/Button";
import MessageSendModal from "@/components/Modal/MessageSend/MessageSendModal";

import { useGetChats } from "@/api/chats/getChats";

import { useModal } from "@/hooks/useModal";

import styles from "./DirectPage.module.scss";

const DirectPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);

  const { openModal } = useModal();

  const { data: chatsData, isLoading } = useGetChats({
    keyword: searchValue,
    size: 20,
  });

  const chatList = chatsData?.chats || [];

  const isAllSelected = chatList.length > 0 && selectedChatIds.length === chatList.length;

  useEffect(() => {
    if (!isEditMode) {
      setSelectedChatIds([]);
    }
  }, [isEditMode]);

  const handleSearch = useCallback((value?: string) => {
    setSearchValue(value);
  }, []);

  const handleEditMode = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const handleCloseEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const handleChatClick = useCallback(
    (chatId: string) => {
      if (isEditMode) {
        handleToggleSelect(chatId);
        return;
      }
      router.push(`/direct/${chatId}`);
    },
    [isEditMode, router],
  );

  const handleToggleSelect = useCallback((chatId: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId],
    );
  }, []);

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
        <div className={styles.loading}>
          <p>채팅 목록을 불러오는 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <DMHeader
        isEditMode={isEditMode}
        searchKeyword={searchValue}
        onSearch={handleSearch}
        onEditMode={handleEditMode}
        onNewMessage={handleNewMessage}
        onCloseEditMode={handleCloseEditMode}
      />

      {chatList.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>아직 주고 받은 메세지가 없어요</p>
          <Button
            type="filled-primary"
            size="m"
            className={styles.emptyButton}
            onClick={handleNewMessage}
          >
            새 메시지 보내기
          </Button>
        </div>
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
        </div>
      )}
    </section>
  );
};

export default DirectPage;
