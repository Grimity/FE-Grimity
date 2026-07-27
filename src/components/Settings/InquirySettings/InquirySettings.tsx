import ListItem from "@/components/common/Cell/ListItem/ListItem";
import { EXTERNAL_URLS } from "@/constants/serviceurl";

import styles from "./InquirySettings.module.scss";

const SUPPORT_EMAIL = "grimity.official@gmail.com";

export default function InquirySettings() {
  const openKakao = () => {
    window.open(EXTERNAL_URLS.KAKAO_INQUIRY, "_blank", "noopener,noreferrer");
  };

  const sendMail = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  };

  return (
    <div className={styles.list}>
      <ListItem type="textLg" text="오픈 카카오톡으로 이동" onClick={openKakao} />
      <ListItem type="textLg" text="메일로 보내기" onClick={sendMail} />
    </div>
  );
}
