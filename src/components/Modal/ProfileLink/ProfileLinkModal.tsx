import Link from "next/link";

import Modal from "@/components/common/PopUp/Modal/Modal";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Icon from "@/components/common/Icon/Icon";

import { useDeviceStore } from "@/states/deviceStore";
import { useClipboard } from "@/utils/copyToClipboard";
import { getLinkIconName, isEmailLink } from "@/utils/profileLinkIcon";

import type { ProfileLinkModalProps } from "./ProfileLinkModal.types";

import styles from "./ProfileLinkModal.module.scss";

const MODAL_TITLE = "프로필 링크";

// 프로토콜은 표시하지 않고 도메인부터 보여준다
const toDisplayUrl = (link: string) => link.replace(/^https?:\/\//, "");

export default function ProfileLinkModal({ links, onClose }: ProfileLinkModalProps) {
  const { copyToClipboard } = useClipboard();
  const { isMobile } = useDeviceStore();

  const content = (
    <ul className={styles.list}>
      {links.map(({ linkName, link }, index) => (
        <li key={index}>
          <Link
            title={link}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (isEmailLink(link)) {
                e.preventDefault();
                copyToClipboard(link, "이메일 주소가 복사되었습니다.");
              }
            }}
          >
            <UserItem
              type="link"
              brandIcon={<Icon name={getLinkIconName(linkName)} size={32} />}
              siteName={linkName}
              url={toDisplayUrl(link)}
            />
          </Link>
        </li>
      ))}
    </ul>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen onClose={onClose} title={MODAL_TITLE} showCloseIcon>
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal title={MODAL_TITLE} onClose={onClose}>
      {content}
    </Modal>
  );
}
