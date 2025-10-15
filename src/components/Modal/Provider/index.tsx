import React, { PropsWithChildren, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { useNewModalStore } from "@/states/modalStore";
import { usePreventScroll } from "@/hooks/usePreventScroll";

import ModalPortal from "@/components/Modal/Portal";
import IconComponent from "@/components/Asset/Icon";

import styles from "@/components/Modal/Modal.module.scss";

function ModalProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { modals, closeModal } = useNewModalStore();
  const historyPushedRef = useRef<Set<string>>(new Set());
  const closedByPopStateRef = useRef<Set<string>>(new Set());

  usePreventScroll(modals.length > 0);

  // isFill 모달이 열릴 때 히스토리 관리
  useEffect(() => {
    const fillModals = modals.filter((modal) => modal.isFill);

    fillModals.forEach((modal) => {
      if (!historyPushedRef.current.has(modal.id)) {
        window.history.pushState(
          { isModalOpen: true, modalId: modal.id },
          "",
          window.location.href,
        );
        historyPushedRef.current.add(modal.id);
        closedByPopStateRef.current.delete(modal.id);
      }
    });

    const handlePopState = () => {
      if (fillModals.length > 0) {
        const latestFillModal = fillModals[fillModals.length - 1];
        closedByPopStateRef.current.add(latestFillModal.id);
        closeModal(latestFillModal.id);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [modals, closeModal]);

  // 라우트 변경 시 모든 모달 닫기
  useEffect(() => {
    const handleRouteChange = () => {
      modals.forEach((modal) => closeModal(modal.id));
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, modals, closeModal]);

  return (
    <>
      {children}
      <ModalPortal>
        {modals.map(({ id, content, props, isFill, title }) => {
          const handleClose = () => {
            if (
              isFill &&
              historyPushedRef.current.has(id) &&
              !closedByPopStateRef.current.has(id)
            ) {
              historyPushedRef.current.delete(id);
              window.history.back();
            } else {
              closeModal(id);
            }
          };

          const node = typeof content === "function" ? content(handleClose) : content;

          if (isFill) {
            return (
              <React.Fragment key={id}>
                {/* 모바일 헤더 */}
                <div className={styles.mobileHeader}>
                  <button onClick={handleClose}>
                    <IconComponent name="x" size={24} isBtn />
                  </button>
                  <h2>{title}</h2>
                </div>
                {/* 전체 화면 콘텐츠 */}
                <div className={styles.fill} onClick={(e) => e.stopPropagation()}>
                  {node}
                </div>
              </React.Fragment>
            );
          }

          return (
            <div key={id} className={styles.overlay} onClick={handleClose}>
              <div onClick={(e) => e.stopPropagation()} {...props}>
                {node}
              </div>
            </div>
          );
        })}
      </ModalPortal>
    </>
  );
}

export default ModalProvider;
