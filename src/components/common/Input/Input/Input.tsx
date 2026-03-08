import { useId } from "react";
import clsx from "clsx";

import Title from "@/components/common/Input/Title/Title";
import TextField from "@/components/common/Input/TextField/TextField";
import TextArea from "@/components/common/Input/TextArea/TextArea";
import HelperText from "@/components/common/Input/HelperText/HelperText";

import styles from "./Input.module.scss";
import { InputProps } from "./Input.types";

export default function Input({
  label,
  showEssential = false,
  inputType = "textfield",
  layout = "default",
  textFieldProps,
  textAreaProps,
  helperMessage,
  helperStatus = "default",
  currentCount,
  maxCount,
  button,
  id: externalId,
  className,
}: InputProps) {
  const autoId = useId();
  const inputId = externalId || autoId;
  const helperId = `${inputId}-helper`;
  const hasHelper = !!helperMessage || (currentCount !== undefined && maxCount !== undefined);
  const isError = helperStatus === "error";

  const fieldStatus = isError ? "error" : "default";

  const ariaDescribedBy = hasHelper ? helperId : undefined;
  const ariaInvalid = isError || undefined;

  return (
    <div className={clsx(styles.input, layout === "horizontal" && styles.horizontal, className)}>
      {label && <Title text={label} showEssential={showEssential} htmlFor={inputId} />}
      <div className={styles.fieldRow}>
        <div className={styles.fieldWrapper}>
          {inputType === "textfield" ? (
            <TextField
              id={inputId}
              status={fieldStatus}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...textFieldProps}
            />
          ) : textAreaProps ? (
            <TextArea
              id={inputId}
              status={fieldStatus}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...textAreaProps}
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
          currentCount={currentCount}
          maxCount={maxCount}
        />
      )}
    </div>
  );
}
