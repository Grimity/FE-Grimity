import Link from "next/link";
import { useRouter } from "next/router";

import { useDeviceStore } from "@/states/deviceStore";

import { useUserDataByUrl } from "@/api/users/getId";

import Icon from "@/components/common/Icon/Icon";
import UserItem from "@/components/common/Cell/UserItem/UserItem";

import { useClipboard } from "@/utils/copyToClipboard";
import { getLinkIconName, isEmailLink } from "@/utils/profileLinkIcon";

import styles from "./ProfileLink.module.scss";

export default function ProfileLink() {
  const { copyToClipboard } = useClipboard();
  const { isMobile } = useDeviceStore();
  const { query } = useRouter();
  const { data: userData } = useUserDataByUrl(query.url as string);

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>프로필 링크</h2>
        </div>
      )}
      <ul className={styles.linksContainer}>
        {userData?.links.map(({ linkName, link }, index) => (
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
                brandIcon={<Icon name={getLinkIconName(linkName)} size={20} />}
                siteName={linkName}
                url={link}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
