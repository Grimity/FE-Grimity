import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";
import { useModalStore } from "@/states/modalStore";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import IconComponent from "../Asset/Icon";
import Icon from "../common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import ProfileId from "./ProfileId/ProfileId";
import Join from "./Join/Join";
import Follow from "./Follow/Follow";
import Like from "./Like/Like";
import AlbumSelect from "./AlbumSelect/AlbumSelect";

// 드래그 앤 드롭 라이브러리를 포함하므로 프로필 수정을 열 때 불러온다
const ProfileEdit = dynamic(() => import("./ProfileEdit/ProfileEdit"));

export default function Modal() {
  const router = useRouter();
  const { isOpen, type, data, isFill, isComfirm, closeModal } = useModalStore();
  const modalRef = useRef<EventTarget | null>(null);
  const historyPushedRef = useRef<boolean>(false);
  const closedByPopStateRef = useRef<boolean>(false);
  const [isConfirming, setIsConfirming] = useState(false);

  usePreventScroll(isOpen);

  useEffect(() => {
    if (isOpen && isFill) {
      window.history.pushState({ isModalOpen: true }, "", window.location.href);
      historyPushedRef.current = true;
      closedByPopStateRef.current = false;
    } else if (!isOpen) {
      historyPushedRef.current = false;
      closedByPopStateRef.current = false;
    }

    const handlePopState = () => {
      closedByPopStateRef.current = true;
      closeModal();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, isFill, closeModal]);

  useEffect(() => {
    const handleRouteChange = () => {
      closeModal();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, closeModal]);

  const handleCloseModal = () => {
    if (historyPushedRef.current && !closedByPopStateRef.current) {
      historyPushedRef.current = false;
      window.history.back();
    } else {
      closeModal();
    }
  };

  /** 확인 액션이 끝날 때까지 진행 상태를 보여준 뒤, 성공한 경우에만 모달을 닫는다. */
  const handleConfirm = async () => {
    if (isConfirming) return;

    setIsConfirming(true);
    try {
      await data?.onClick?.();
      handleCloseModal();
    } catch {
      // 에러 토스트 등 실패 노출은 각 호출부가 담당한다. 모달은 열어둔 채 재시도할 수 있게 한다.
    } finally {
      setIsConfirming(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      modalRef.current = e.target;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (modalRef.current && modalRef.current === e.target && !isConfirming) {
      handleCloseModal();
    }
    modalRef.current = null;
  };

  const renderModalContent = () => {
    switch (type) {
      case "PROFILE-ID":
        return <ProfileId />;
      case "JOIN":
        return <Join />;
      case "PROFILE-EDIT":
        return <ProfileEdit />;
      case "FOLLOWER":
        return <Follow initialTab="follower" title={data?.title} />;
      case "FOLLOWING":
        return <Follow initialTab="following" title={data?.title} />;
      case "LIKE":
        return <Like />;
      case "ALBUM-SELECT":
        return <AlbumSelect {...data} />;
      default:
        return null;
    }
  };

  const isFollowModal = type === "FOLLOWER" || type === "FOLLOWING";

  if (!isOpen) return null;

  return (
    <>
      {isOpen && isFill && type !== "PROFILE-EDIT" && (
        <div
          className={`${styles.mobileHeader} ${isFollowModal ? styles.mobileHeaderBack : ""}`}
        >
          <button
            onClick={handleCloseModal}
            aria-label={isFollowModal ? "뒤로가기" : "닫기"}
          >
            {isFollowModal ? (
              <Icon name="chevron-left" size={24} />
            ) : (
              <IconComponent name="x" size={24} isBtn />
            )}
          </button>
          <h2>{data?.title}</h2>
        </div>
      )}

      {isFill ? (
        <div
          className={type === "PROFILE-EDIT" ? styles.fillProfileEdit : styles.fill}
          onClick={(e) => e.stopPropagation()}
        >
          {renderModalContent()}
        </div>
      ) : (
        <div className={styles.overlay} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
          {isComfirm ? (
            <div className={styles.comfirmModal}>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>{data?.title}</h2>
                {data?.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
              </div>
              <div className={styles.btnsContainer}>
                <div className={styles.btnWrap}>
                  <OutlinedButton size="large" onClick={handleCloseModal} disabled={isConfirming}>
                    취소
                  </OutlinedButton>
                </div>
                <div className={styles.btnWrap}>
                  <SolidButton size="large" onClick={handleConfirm} loading={isConfirming}>
                    {data?.confirmBtn}
                  </SolidButton>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={
                type === "PROFILE-EDIT"
                  ? styles.profileEditModal
                  : type === "FOLLOWER" || type === "FOLLOWING"
                  ? styles.followListModal
                  : type === "LIKE"
                  ? styles.followModal
                  : type == "ALBUM-SELECT"
                  ? styles.albumSelectModal
                  : styles.modal
              }
              onClick={(e) => e.stopPropagation()}
            >
              {renderModalContent()}
              {!data?.hideCloseButton && type !== "PROFILE-EDIT" && (
                <button className={styles.closeButton} onClick={handleCloseModal} aria-label="닫기">
                  <IconComponent name="x" size={24} isBtn />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
