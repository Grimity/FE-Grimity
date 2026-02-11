import Link from "next/link";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";

import styles from "@/styles/pages/BusinessInfo.module.scss";

const BUSINESS_INFO = [
  { label: "사업자 등록 번호", value: "408-27-02500" },
  { label: "법인 여부", value: "개인" },
  { label: "상호", value: "그리미티 (Grimity)" },
  { label: "대표자명", value: "임종훈" },
  { label: "전화번호", value: "070-8098-7916" },
  { label: "개업일", value: "2025-10-11" },
  { label: "전자우편", value: "grimity.official@gmail.com" },
  {
    label: "사업장소재지(도로명)",
    value: "부산광역시 사상구 가야대로255번길 5, 107동 104호",
  },
] as const;

const DOMAIN_URL = "https://www.grimity.com/";

const OGTitle = "사업자 정보 - 그리미티";
const OGUrl = `${serviceUrl}/business-info`;

const BusinessInfoPage = () => {
  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <section className={styles.container}>
        <h1 className={styles.title}>사업자 정보</h1>
        <div className={styles.infoList}>
          {BUSINESS_INFO.map((item) => (
            <div key={item.label} className={styles.infoItem}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{item.value}</span>
            </div>
          ))}
          <div className={styles.infoItem}>
            <span className={styles.label}>인터넷 도메인</span>
            <Link href="/" className={styles.link}>
              {DOMAIN_URL}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BusinessInfoPage;
