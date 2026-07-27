import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { useNewModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";
import Report from "@/components/Modal/Report/Report";
import { ReportRefType } from "@/api/reports/postReports";

export interface OpenReportParams {
  refType: ReportRefType;
  refId: string;
}

/**
 * 신고하기 모달
 * Report 컴포넌트가 자체 오버레이/레이아웃을 가지므로 bare 옵션으로 마운트
 */
export function useReportModal() {
  const open = useNewModalStore((s) => s.openModal);
  const close = useNewModalStore((s) => s.closeModal);
  const isMobile = useDeviceStore((s) => s.isMobile);

  return useCallback(
    ({ refType, refId }: OpenReportParams) => {
      const id = uuidv4();
      open(
        id,
        (handleClose) => <Report refType={refType} refId={refId} onClose={handleClose} />,
        undefined,
        isMobile,
        undefined,
        true,
      );
      return () => close(id);
    },
    [open, close, isMobile],
  );
}
