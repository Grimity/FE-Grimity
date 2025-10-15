import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { useModalStore } from "@/states/modalStore";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import IconComponent from "../Asset/Icon";
import Button from "../Button/Button";
import Login from "./Login/Login";
import Nickname from "./Nickname/Nickname";
import ProfileId from "./ProfileId/ProfileId";
import Join from "./Join/Join";
import ProfileEdit from "./ProfileEdit/ProfileEdit";
import Background from "./Background/Background";
import Follow from "./Follow/Follow";
import Share from "./Share/Share";
import UploadModal from "./Upload/Upload";
import SharePost from "./SharePost/SharePost";
import Like from "./Like/Like";
import Report from "./Report/Report";
import AlbumEdit from "./AlbumEdit/AlbumEdit";
import AlbumSelect from "./AlbumSelect/AlbumSelect";
import AlbumMove from "./AlbumMove/AlbumMove";
import AlbumDelete from "./AlbumDelete/AlbumDelete";
import ProfileLink from "./ProfileLink/ProfileLink";
import ShareProfile from "./ShareProfile/ShareProfile";

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

      if (type === "ALBUM-EDIT") {
        router.reload();
      }
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
      case "NICKNAME":
        return <Nickname />;
      case "PROFILE-ID":
        return <ProfileId />;
      case "JOIN":
        return <Join />;
      case "PROFILE-EDIT":
        return <ProfileEdit />;
      case "PROFILE-LINK":
        return <ProfileLink />;
      case "SHARE-PROFILE":
        return <ShareProfile {...data} />;
      case "BACKGROUND":
        return (
          <Background
            imageSrc={data?.imageSrc}
            file={data?.file}
            onUploadSuccess={data?.onUploadSuccess}
          />
        );
      case "FOLLOWER":
        return <Follow initialTab="follower" />;
      case "FOLLOWING":
        return <Follow initialTab="following" />;
      case "SHARE":
        return <Share {...data} />;
      case "SHAREPOST":
        return <SharePost {...data} />;
      case "UPLOAD":
        return <UploadModal {...data} />;
      case "LIKE":
        return <Like />;
      case "REPORT":
        return <Report {...data} closeModal={handleCloseModal} />;
      case "ALBUM-EDIT":
        return <AlbumEdit {...data} />;
      case "ALBUM-SELECT":
        return <AlbumSelect {...data} />;
      case "ALBUM-MOVE":
        return <AlbumMove {...data} />;
      case "ALBUM-DELETE":
        return <AlbumDelete {...data} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && isFill && (
        <div className={styles.mobileHeader}>
          <button onClick={handleCloseModal}>
            <IconComponent name="x" size={24} isBtn />
          </button>
          <h2>{data?.title}</h2>
        </div>
      )}

      {isFill ? (
        <div className={styles.fill} onClick={(e) => e.stopPropagation()}>
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
                  : type === "PROFILE-LINK"
                  ? styles.profileLinkModal
                  : type === "FOLLOWER" || type === "FOLLOWING" || type === "LIKE"
                  ? styles.followModal
                  : type == "ALBUM-EDIT"
                  ? styles.albumEditModal
                  : type == "ALBUM-SELECT" || type == "ALBUM-MOVE"
                  ? styles.albumSelectModal
                  : type == "ALBUM-DELETE"
                  ? styles.albumDeleteModal
                  : styles.modal
              }
              onClick={(e) => e.stopPropagation()}
            >
              {renderModalContent()}
              {!data?.hideCloseButton && (
                <button className={styles.closeButton} onClick={handleCloseModal}>
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
