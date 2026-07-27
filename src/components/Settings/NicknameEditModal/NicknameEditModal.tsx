import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useMyData } from "@/api/users/getMe";
import { putMyInfo, toProfileUpdatePayload, UpdateProfileConflictResponse } from "@/api/users/putMe";

import { useToast } from "@/hooks/useToast";

import Input from "@/components/common/Input/Input/Input";
import SettingsEditModal from "@/components/Settings/SettingsEditModal/SettingsEditModal";

const MAX_LENGTH = 12;

interface NicknameEditModalProps {
  onClose: () => void;
}

export default function NicknameEditModal({ onClose }: NicknameEditModalProps) {
  const { data: myData, refetch } = useMyData();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: putMyInfo,
    onSuccess: () => {
      showToast("닉네임이 변경되었습니다.", "success");
      refetch();
      onClose();
    },
    onError: (err: AxiosError<UpdateProfileConflictResponse>) => {
      if (err.response?.status === 409 && err.response?.data?.message === "NAME") {
        setError("중복된 닉네임입니다.");
      } else {
        showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      }
    },
  });

  const trimmed = name.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= MAX_LENGTH;

  const handleSave = () => {
    if (!myData) return;
    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (trimmed.length < 2) {
      setError("닉네임은 두 글자 이상 입력해야 합니다.");
      return;
    }

    mutate(toProfileUpdatePayload(myData, { name: trimmed }));
  };

  return (
    <SettingsEditModal
      modalTitle="닉네임 변경"
      fillTitle="새로운 닉네임을 입력해주세요"
      onClose={onClose}
      onSave={handleSave}
      saveDisabled={!isValid || isPending}
    >
      <Input
        inputType="textfield"
        helperMessage={error || undefined}
        helperStatus={error ? "error" : "default"}
        textFieldProps={{
          variant: "count",
          maxCount: MAX_LENGTH,
          value: name,
          placeholder: myData?.name ?? "닉네임을 입력해주세요.",
          onChange: (e) => {
            setName(e.target.value);
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
