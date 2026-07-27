import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import Modal from "@/components/common/PopUp/Modal/Modal";
import Backdrop from "@/components/common/PopUp/Backdrop/Backdrop";
import Alert from "@/components/common/PopUp/Alert/Alert";
import GNB from "@/components/common/Navigation/GNB/GNB";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import TextArea from "@/components/common/Input/TextArea/TextArea";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import { postReports, ReportType } from "@/api/reports/postReports";
import { ReportProps } from "./Report.types";
import styles from "./Report.module.scss";

type ReportStep = "form" | "confirm" | "complete";

const REPORT_REASONS: ReportType[] = [
  "사칭계정",
  "스팸/도배",
  "욕설/비방",
  "부적절한 프로필",
  "선정적인 컨텐츠",
  "기타",
];

const MAX_DETAIL_LENGTH = 500;

export default function Report({ refType, refId, onClose }: ReportProps) {
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();
  const alertSize = isMobile ? "md" : "xl";

  const [step, setStep] = useState<ReportStep>("form");
  const [reason, setReason] = useState<ReportType | null>(null);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDetailRequired = reason === "기타";
  const canSubmit = reason !== null && (!isDetailRequired || details.trim().length > 0);

  const handleRequestSubmit = () => {
    if (!canSubmit) return;
    setStep("confirm");
  };

  const handleConfirmSubmit = async () => {
    if (reason === null || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await postReports({
        type: reason,
        refType,
        refId,
        content: details.trim() || undefined,
      });
      setStep("complete");
    } catch {
      showToast("신고 중 오류가 발생했습니다.", "error");
      setStep("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "confirm") {
    return (
      <Backdrop>
        <Alert
          variant="content"
          size={alertSize}
          title="신고하시겠어요?"
          contentText={"신고 접수 후에는 취소가 어려워요.\n허위 신고 시 서비스 이용이 제한될 수 있어요."}
          secondaryLabel="아니요"
          onSecondary={() => setStep("form")}
          primaryLabel="신고하기"
          onPrimary={handleConfirmSubmit}
        />
      </Backdrop>
    );
  }

  if (step === "complete") {
    return (
      <Backdrop>
        <Alert
          variant="normal"
          size={alertSize}
          title="신고가 접수되었어요"
          contentText={"관리자의 검토 후\n적절한 조치가 이루어질 예정이에요"}
          primaryLabel="확인"
          onPrimary={onClose}
        />
      </Backdrop>
    );
  }

  const formFields = (
    <>
      <section className={styles.field}>
        <h3 className={styles.fieldTitle}>
          신고 사유를 선택해주세요 <span className={styles.required}>(필수)</span>
        </h3>
        <div className={styles.reasonList}>
          {REPORT_REASONS.map((option) => (
            <ListItem
              key={option}
              type="radio"
              text={option}
              active={reason === option}
              onClick={() => setReason(option)}
            />
          ))}
        </div>
      </section>

      <section className={styles.field}>
        <h3 className={styles.fieldTitle}>
          자세한 내용을 알려주세요{" "}
          {isDetailRequired ? (
            <span className={styles.required}>(필수)</span>
          ) : (
            <span className={styles.optional}>(선택)</span>
          )}
        </h3>
        <TextArea
          className={styles.detailTextarea}
          maxCount={MAX_DETAIL_LENGTH}
          placeholder="구체적인 사유를 적어주세요"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </section>
    </>
  );

  if (isMobile) {
    return (
      <div
        className={styles.mobileFill}
        role="dialog"
        aria-modal="true"
        aria-label="신고하기"
      >
        <GNB variant="three-button" title="신고하기" onBack={onClose} />

        <div className={styles.mobileContent}>{formFields}</div>

        {/*
         * TODO: 공통 Modal에 fullscreen/mobile variant가 추가되면 이 푸터를 그쪽으로 통합한다.
         */}
        <div className={styles.mobileActions}>
          <OutlinedButton
            size="large"
            onClick={onClose}
            className={styles.mobileActionButton}
          >
            닫기
          </OutlinedButton>
          <SolidButton
            size="large"
            onClick={handleRequestSubmit}
            disabled={!canSubmit}
            className={styles.mobileActionButton}
          >
            신고하기
          </SolidButton>
        </div>
      </div>
    );
  }

  return (
    <Modal
      title="신고하기"
      onClose={onClose}
      buttonType="double"
      secondaryLabel="닫기"
      onSecondary={onClose}
      primaryLabel="신고하기"
      onPrimary={handleRequestSubmit}
      primaryDisabled={!canSubmit}
    >
      <div className={styles.form}>{formFields}</div>
    </Modal>
  );
}
