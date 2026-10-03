import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { useModalStore } from "@/states/modalStore";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import IconComponent from "../Asset/Icon";
import Icon from "../common/Icon/Icon";
import Button from "../Button/Button";
import Login from "./Login/Login";
import ProfileId from "./ProfileId/ProfileId";
import Join from "./Join/Join";
import Follow from "./Follow/Follow";
import UploadModal from "./Upload/Upload";
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      modalRef.current = e.target;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (modalRef.current && modalRef.current === e.target) {
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
      case "UPLOAD":
        return <UploadModal {...data} />;
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
                <Button size="l" type="outlined-assistive" onClick={handleCloseModal}>
                  취소
                </Button>
                <Button size="l" type="filled-primary" onClick={data?.onClick}>
                  {data?.confirmBtn}
                </Button>
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
