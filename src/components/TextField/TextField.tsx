import styles from "./TextField.module.scss";
import { TextFieldProps } from "./TextField.types";
import { forwardRef } from "react";

interface ExtendedTextFieldProps extends TextFieldProps {
  prefix?: string;
}

const TextField = forwardRef<HTMLInputElement, ExtendedTextFieldProps>(
  (
    {
      placeholder,
      label,
      isError,
      errorMessage,
      maxLength,
      value,
      onChange,
      onKeyDown,
      onFocus,
      isReply,
      prefix,
    },
    ref,
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event);
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
    };

    return (
      <div className={styles.container}>
        {label && (
          <div className={styles.labelContainer}>
            <label className={styles.label} htmlFor="label">
              {label}
            </label>
          </div>
        )}
        <div
          className={`${isReply ? styles.inputReplyContainer : styles.inputContainer} ${
            isError && styles.error
          }`}
        >
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <input
            ref={ref}
            className={`${styles.input} ${prefix ? styles.inputWithPrefix : ""}`}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleEnter}
            maxLength={maxLength}
            onFocus={onFocus}
            id="label"
          />
          {value && maxLength && (
            <div className={styles.countTotal}>
              <p className={styles.count}>{value.length}</p>/{maxLength}
            </div>
          )}
        </div>
        {isError && <span className={styles.error}>{errorMessage}</span>}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
