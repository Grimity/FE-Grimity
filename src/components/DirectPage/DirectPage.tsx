import { useState } from "react";

import SearchBar from "@/components/SearchBar/SearchBar";

import styles from "@/components/DirectPage/DirectPage.module.scss";
import Button from "@/components/Button/Button";
import Icon from "@/components/Asset/IconTemp";
import Chip from "@/components/Chip/Chip";

const DirectPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [chatList, setChatList] = useState<[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSearch = (value: string) => {
    console.log(value);
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleCloseEditMode = () => {
    setIsEditMode(false);
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>DM</h1>
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          placeholder="작가 이름을 검색해 보세요"
          onSearch={handleSearch}
        />
      </div>

      {false ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>아직 주고 받은 메세지가 없어요</p>
        </div>
      ) : (
        <div className={styles.chatContainer}>
          <div className={styles.buttonList}>
            {isEditMode ? (
              <>
                <button className={styles.button} type="button">
                  <Chip type="outlined-assistive" size="s" disabled>
                    채팅 나가기
                  </Chip>
                </button>
                <button className={styles.button} type="button" onClick={handleCloseEditMode}>
                  <Chip type="filled-assistive" leftIcon={<Icon icon="close" />} size="s">
                    취소
                  </Chip>
                </button>
              </>
            ) : (
              <button className={styles.button} type="button" onClick={handleEditMode}>
                <Chip
                  className={styles.editButton}
                  type="outlined-assistive"
                  leftIcon={<Icon icon="setting" />}
                  size="s"
                >
                  편집
                </Chip>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default DirectPage;
