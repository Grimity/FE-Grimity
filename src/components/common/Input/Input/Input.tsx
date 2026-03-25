import { useId, useState } from "react";
import clsx from "clsx";

import Title from "@/components/common/Input/Title/Title";
import TextField from "@/components/common/Input/TextField/TextField";
import TextArea from "@/components/common/Input/TextArea/TextArea";
import MentionTextField from "@/components/common/Input/MentionTextField/MentionTextField";
import HelperText from "@/components/common/Input/HelperText/HelperText";
import Icon from "@/components/common/Icon/Icon";

import styles from "./Input.module.scss";
import { InputProps } from "./Input.types";

export default function Input({
  label,
  showEssential = false,
  inputType = "textfield",
  layout = "default",
  textFieldProps,
  textAreaProps,
  mentionTextFieldProps,
  helperMessage,
  helperStatus = "default",
  maxCount,
  replyTo,
  button,
  id: externalId,
  className,
}: InputProps) {
  const autoId = useId();
  const inputId = externalId || autoId;
  const helperId = `${inputId}-helper`;
  const hasHelper = !!helperMessage || maxCount !== undefined;
  const isError = helperStatus === "error";

  const fieldStatus = isError ? "error" : "default";

  const ariaDescribedBy = hasHelper ? helperId : undefined;
  const ariaInvalid = isError || undefined;

  const [charCount, setCharCount] = useState(() => {
    if (inputType === "textfield") {
      const dv = textFieldProps?.defaultValue;
      return typeof dv === "string" ? dv.length : 0;
    }
    if (inputType === "mention") {
      return mentionTextFieldProps?.defaultValue?.length ?? 0;
    }
    if (inputType === "textarea") {
      const dv = textAreaProps?.defaultValue;
      return typeof dv === "string" ? dv.length : 0;
    }
    return 0;
  });

  return (
    <div className={clsx(styles.input, layout === "horizontal" && styles.horizontal, className)}>
      {label && <Title text={label} showEssential={showEssential} htmlFor={inputId} />}
      {replyTo && (
        <div className={styles.replyHeader}>
          <Icon name="forward-2" size={16} />
          <span>{replyTo.nickname}님에게 답장</span>
        </div>
      )}
      <div className={styles.fieldRow}>
        <div className={styles.fieldWrapper}>
          {inputType === "textfield" ? (
            <TextField
              id={inputId}
              status={fieldStatus}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...textFieldProps}
              onChange={(e) => {
                setCharCount(e.target.value.length);
                textFieldProps?.onChange?.(e);
              }}
            />
          ) : inputType === "mention" && mentionTextFieldProps ? (
            <MentionTextField
              id={inputId}
              status={fieldStatus}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...mentionTextFieldProps}
              onChange={(value, mentionIds) => {
                setCharCount(value.length);
                mentionTextFieldProps.onChange?.(value, mentionIds);
              }}
            />
          ) : inputType === "textarea" && textAreaProps ? (
            <TextArea
              id={inputId}
              status={fieldStatus}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...textAreaProps}
              onChange={(e) => {
                setCharCount(e.target.value.length);
                textAreaProps.onChange?.(e);
              }}
            />
          ) : null}
        </div>
        {button}
      </div>
      {hasHelper && (
        <HelperText
          id={helperId}
          message={helperMessage}
          status={helperStatus}
          currentCount={maxCount !== undefined ? charCount : undefined}
          maxCount={maxCount}
        />
      )}
    </div>
  );
}
