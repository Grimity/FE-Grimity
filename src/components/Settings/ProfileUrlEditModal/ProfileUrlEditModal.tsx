import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useMyData } from "@/api/users/getMe";
import { putMyInfo, toProfileUpdatePayload, UpdateProfileConflictResponse } from "@/api/users/putMe";

import { useToast } from "@/hooks/useToast";
import { isValidProfileIdFormat, isForbiddenProfileId } from "@/utils/isValidProfileId";

import Input from "@/components/common/Input/Input/Input";
import SettingsEditModal from "@/components/Settings/SettingsEditModal/SettingsEditModal";

import { serviceUrl } from "@/constants/serviceurl";

import styles from "./ProfileUrlEditModal.module.scss";

const URL_PREFIX = `${(serviceUrl ?? "www.grimity.com").replace(/^https?:\/\//, "")}/`;

interface ProfileUrlEditModalProps {
  onClose: () => void;
}

export default function ProfileUrlEditModal({ onClose }: ProfileUrlEditModalProps) {
  const { data: myData, refetch } = useMyData();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: putMyInfo,
    onSuccess: () => {
      showToast("프로필 URL이 변경되었습니다.", "success");
      refetch();
      onClose();
    },
    onError: (err: AxiosError<UpdateProfileConflictResponse>) => {
      if (err.response?.status === 409 && err.response?.data?.message === "URL") {
        setError("이미 사용 중인 프로필 URL입니다.");
      } else {
        showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      }
    },
  });

  const trimmed = url.trim();

  const handleSave = () => {
    if (!myData) return;
    if (!trimmed) {
      setError("프로필 URL을 입력해주세요.");
      return;
    }
    if (!isValidProfileIdFormat(trimmed)) {
      setError("숫자, 영문(소문자), 언더바(_)만 입력해 주세요.");
      return;
    }
    if (isForbiddenProfileId(trimmed)) {
      setError("사용할 수 없는 URL입니다.");
      return;
    }

    mutate(toProfileUpdatePayload(myData, { url: trimmed }));
  };

  return (
    <SettingsEditModal
      modalTitle="프로필 URL"
      fillTitle="새로운 프로필 URL을 정해주세요"
      onClose={onClose}
      onSave={handleSave}
      saveDisabled={!trimmed || isPending}
    >
      <p className={styles.prefix}>{URL_PREFIX}</p>
      <Input
        inputType="textfield"
        helperMessage={error || undefined}
        helperStatus={error ? "error" : "default"}
        textFieldProps={{
          value: url,
          placeholder: "숫자, 영문(소문자), 언더바(_)",
          onChange: (e) => {
            setUrl(e.target.value);
            if (error) setError("");
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" && !isPending) {
              e.preventDefault();
              handleSave();
            }
          },
        }}
      />
    </SettingsEditModal>
  );
}
