import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Icon from "@/components/common/Icon/Icon";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";

import styles from "@/styles/pages/signup-complete.module.scss";

export default function SignupCompletePage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>회원가입 완료 | 그리미티</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <div className={styles.messageSection}>
              <Icon
                name="illust-upload-success"
                size={64}
                className={styles.successIcon}
                aria-label="회원가입 완료"
              />
              <div className={styles.textBlock}>
                <h1 className={styles.title}>가입을 축하드려요!</h1>
                <p className={styles.description}>
                  마음껏 그림을 공유하고
                  <br />
                  자유롭게 이야기를 나눠보세요
                </p>
              </div>
            </div>
            <SolidButton
              size="large"
              className={styles.submitBtn}
              onClick={() => router.push("/")}
            >
              그리미티 시작하기
            </SolidButton>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <TextButton
              variant="assistive"
              size="large"
              iconLeft={<Icon name="info-circle" size={20} />}
              onClick={() => router.push("/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a")}
              className={styles.footerBtn}
            >
              공지사항
            </TextButton>
            <TextButton
              variant="assistive"
              size="large"
              iconLeft={<Icon name="question-circle" size={20} />}
              onClick={() => window.open("https://open.kakao.com/o/sKYFewgh", "_blank", "noopener,noreferrer")}
              className={styles.footerBtn}
            >
              문의
            </TextButton>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <Link
                href="https://term.grimity.com/term"
                target="_blank"
                rel="noopener noreferrer"
              >
                이용약관
              </Link>
              <span className={styles.dot} />
              <Link
                href="https://term.grimity.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보처리방침
              </Link>
            </div>
            <p className={styles.copyright}>© Grimity. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
