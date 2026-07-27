import { useRouter } from "next/router";

import ListItem from "@/components/common/Cell/ListItem/ListItem";
import { EXTERNAL_URLS } from "@/constants/serviceurl";
import { PATH_ROUTES } from "@/constants/routes";

import styles from "./GuideSettings.module.scss";

interface GuideLink {
  label: string;
  href: string;
  external: boolean;
}

const GUIDE_LINKS: GuideLink[] = [
  { label: "이용약관", href: EXTERNAL_URLS.TERMS, external: true },
  { label: "개인정보처리방침", href: EXTERNAL_URLS.PRIVACY, external: true },
  { label: "사업자 정보", href: PATH_ROUTES.BUSINESS_INFO, external: false },
];

export default function GuideSettings() {
  const router = useRouter();

  const handleClick = (link: GuideLink) => {
    if (link.external) {
      window.open(link.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(link.href);
    }
  };

  return (
    <div className={styles.list}>
      {GUIDE_LINKS.map((link) => (
        <ListItem
          key={link.label}
          type="rightIcon"
          text={link.label}
          onClick={() => handleClick(link)}
        />
      ))}
    </div>
  );
}
