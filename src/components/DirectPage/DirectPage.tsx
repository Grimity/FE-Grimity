import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import styles from "./DirectPage.module.scss";
import DMHeader from "./DMHeader/DMHeader";
import DMControls from "./DMControls/DMControls";
import ChatList from "./ChatList/ChatList";

// 실제로는 types 디렉토리나 별도의 파일로 분리하는 것이 좋습니다.
export interface TempChat {
  id: number;
  username: string;
  lastMessage: string;
  avatar: string;
  timestamp: string;
  unreadCount: number;
}

// 수정된 임시 채팅 목록 데이터
const tempChatListData: TempChat[] = [
  {
    id: 1,
    username: "으아아케이크",
    lastMessage: "우와 진짜 잘 그리셨어요~!! ㅎㅎㅎㅎㅎ 길면...",
    avatar: "/image/default-cover.png",
    timestamp: "1시간 전",
    unreadCount: 12,
  },
  {
    id: 2,
    username: "네모네모",
    lastMessage: "네모네모님이 이미지를 보냈어요",
    avatar: "/image/default.svg",
    timestamp: "1시간 전",
    unreadCount: 100,
  }, // 99+ 테스트
  {
    id: 3,
    username: "아메리카노",
    lastMessage: "감사합니다",
    avatar: "/image/default.svg",
    timestamp: "3일 전",
    unreadCount: 0,
  },
  {
    id: 4,
    username: "워녕녕",
    lastMessage: "ㄱㅅ해요",
    avatar: "/image/default.svg",
    timestamp: "3일 전",
    unreadCount: 0,
  },
  {
    id: 5,
    username: "fefefefefifififi",
    lastMessage: "ㅋㅋㅋㅋㅋ",
    avatar: "/image/default.svg",
    timestamp: "3일 전",
    unreadCount: 0,
  },
];

const DirectPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [chatList, setChatList] = useState<TempChat[]>(tempChatListData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

  const isAllSelected = chatList.length > 0 && selectedChatIds.length === chatList.length;

  useEffect(() => {
    if (!isEditMode) {
      setSelectedChatIds([]);
    }
  }, [isEditMode]);

  const handleSearch = useCallback((value: string) => {
    console.log(value);
  }, []);

  const handleEditMode = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const handleCloseEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const handleChatClick = useCallback(
    (chatId: number) => {
      if (isEditMode) {
        handleToggleSelect(chatId);
        return;
      }
      router.push(`/direct/${chatId}`);
    },
    [isEditMode, router],
  );

  const handleToggleSelect = useCallback((chatId: number) => {
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

  return (
    <section className={styles.container}>
      <DMHeader searchValue={searchValue} setSearchValue={setSearchValue} onSearch={handleSearch} />

      {chatList.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>아직 주고 받은 메세지가 없어요</p>
        </div>
      ) : (
        <div className={styles.chatContainer}>
          <DMControls
            isEditMode={isEditMode}
            isAllSelected={isAllSelected}
            selectedChatIds={selectedChatIds}
            onEditMode={handleEditMode}
            onCloseEditMode={handleCloseEditMode}
            onSelectAll={handleSelectAll}
          />

          <ChatList
            chatList={chatList}
            isEditMode={isEditMode}
            selectedChatIds={selectedChatIds}
            onChatClick={handleChatClick}
            onToggleSelect={handleToggleSelect}
          />
        </div>
      )}
    </section>
  );
};

export default DirectPage;
