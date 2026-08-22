import Link from "next/link";

import { useModalStore } from "@/states/modalStore";
import UserInfo from "@/components/common/Cell/UserInfo/UserInfo";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Icon from "@/components/common/Icon/Icon";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import { formatCurrency } from "@/utils/formatCurrency";
import { useClipboard } from "@/utils/copyToClipboard";
import { EMAIL_PATTERN, getLinkIconName } from "@/utils/profileLinkIcon";

import styles from "./ProfileDetails.module.scss";

const MAX_VISIBLE_LINKS = 3;

interface ProfileDetailsProps extends React.PropsWithChildren {
  userData: UserData;
  isMyProfile: boolean;
  isMobile: boolean;
  handleOpenFollowerModal: () => void;
  handleOpenFollowingModal: () => void;
}

export default function ProfileDetails({
  userData,
  isMyProfile,
  isMobile,
  children,
  handleOpenFollowerModal,
  handleOpenFollowingModal,
}: ProfileDetailsProps) {
  const { copyToClipboard } = useClipboard();
  const openModal = useModalStore((state) => state.openModal);

  const displayName = (linkName: string, link: string) => {
    if (EMAIL_PATTERN.test(link)) return link;
    if (linkName === "X") {
      const handleMatch = link.match(/^https?:\/\/(?:www\.)?x\.com\/([a-zA-Z0-9_]+)/i);
      return handleMatch ? `@${handleMatch[1]}` : linkName;
    }
    return linkName;
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.nameContainer}>
          <h2 className={styles.name}>{userData.name}</h2>
          <UserInfo
            type="follow"
            followerCount={formatCurrency(userData.followerCount)}
            showFollowing={isMyProfile}
            followingCount={isMyProfile ? formatCurrency(userData.followingCount) : undefined}
            onFollowerClick={isMyProfile ? handleOpenFollowerModal : undefined}
            onFollowingClick={isMyProfile ? handleOpenFollowingModal : undefined}
          />
        </div>
        <div className={styles.actionsSlot}>{children}</div>
      </div>

      {userData.description && <p className={styles.description}>{userData.description}</p>}

      <div className={styles.linkContainer}>
        {userData.links.slice(0, MAX_VISIBLE_LINKS).map(({ linkName, link }, index) => (
          <div key={index} className={styles.linkWrapper}>
            <Link
              title={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (EMAIL_PATTERN.test(link)) {
                  e.preventDefault();
                  copyToClipboard(link, "이메일 주소가 복사되었습니다.");
                }
              }}
            >
              <UserItem
                type="link"
                brandIcon={<Icon name={getLinkIconName(linkName)} size={20} />}
                siteName={displayName(linkName, link)}
              />
            </Link>
            {index === MAX_VISIBLE_LINKS - 1 && userData.links.length > MAX_VISIBLE_LINKS && (
              <span
                className={styles.moreLinksText}
                onClick={() =>
                  openModal({
                    type: "PROFILE-LINK",
                    data: { title: "프로필 링크" },
                    isFill: isMobile,
                  })
                }
              >
                외 링크 {userData.links.length - MAX_VISIBLE_LINKS}개
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
