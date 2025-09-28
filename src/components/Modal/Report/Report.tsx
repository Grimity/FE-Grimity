import React, { useState } from "react";
import { useToast } from "@/hooks/useToast";
import styles from "./Report.module.scss";
import { useModalStore } from "@/states/modalStore";
import Button from "@/components/Button/Button";
import { ReportProps } from "./Report.types";
import { postReports, ReportType } from "@/api/reports/postReports";

export default function Report({ refType, refId, closeModal }: ReportProps) {
  const { showToast } = useToast();
  const openModal = useModalStore((state) => state.openModal);

  const [reason, setReason] = useState<ReportType>("사칭계정");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      showToast("신고 사유를 선택해주세요.", "error");
      return;
    }

    openModal({
      type: null,
      data: {
        title: "신고하시겠어요?",
        subtitle: "신고 접수 후에는 취소가 어려워요.",
        confirmBtn: "신고하기",
        onClick: async () => {
          try {
            const response = await postReports({
              type: reason,
              refType,
              refId,
              content: details || undefined,
            });
            if (response) {
              showToast("신고가 접수되었어요.", "success");
              closeModal();
            }
          } catch (err) {
            showToast("신고 중 오류가 발생했습니다.", "error");
            closeModal();
          }
        },
      },
      isComfirm: true,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>신고하기</div>
      <div className={styles.typeContainer}>
        <div className={styles.message}>
          신고 사유를 선택해주세요 <p className={styles.op1}>(필수)</p>
        </div>
        <section className={styles.options}>
          {["사칭계정", "스팸/도배", "욕설/비방", "부적절한 프로필", "선정적인 컨텐츠", "기타"].map(
            (option) => (
              <label key={option} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="reason"
                  value={option}
                  checked={reason === option}
                  className={styles.radioInput}
                  onChange={(e) => setReason(e.target.value as ReportType)}
                />
                <span className={styles.radioImage}></span>
                {option}
              </label>
            ),
          )}
        </section>
      </div>
      <div className={styles.message}>
        자세한 내용을 알려주세요 <p className={styles.op2}>(선택)</p>
      </div>
      <div className={styles.textareaContainer}>
        <textarea
          placeholder="구체적인 사유를 적어주세요."
          value={details}
          className={styles.textarea}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
      <div className={styles.btns}>
        <Button size="l" type="outlined-assistive" onClick={closeModal}>
          취소
        </Button>
        <Button size="l" type="filled-primary" onClick={handleSubmit}>
          신고하기
        </Button>
      </div>
    </div>
  );
}
