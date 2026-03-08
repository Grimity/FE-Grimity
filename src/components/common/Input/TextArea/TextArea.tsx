import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import baseStyles from "../FormFieldBase.module.scss";
import styles from "./TextArea.module.scss";
import { TextAreaProps } from "./TextArea.types";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = "default",
      status = "default",
      maxCount,
      autoResize = false,
      className,
      disabled,
      onInput,
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const isDisabled = disabled || status === "disabled";
    const isError = status === "error";

    const getInitialCount = () => {
      if (typeof rest.value === "string") return rest.value.length;
      if (typeof rest.defaultValue === "string") return rest.defaultValue.length;
      return 0;
    };

    const [charCount, setCharCount] = useState(getInitialCount);

    const isControlled = rest.value !== undefined;

    useEffect(() => {
      if (isControlled) {
        setCharCount(String(rest.value).length);
      }
    }, [isControlled, rest.value]);

    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    useEffect(() => {
      adjustHeight();
    }, [adjustHeight, rest.value]);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      if (!isControlled) {
        setCharCount(target.value.length);
      }
      adjustHeight();
      onInput?.(e);
    };

    const setRefs = (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as React.RefObject<HTMLTextAreaElement | null>).current = el;
      }
    };

    const wrapperClass = clsx(
      baseStyles.wrapper,
      styles.wrapper,
      variant === "underline" && styles.underline,
      variant === "text" && styles.text,
      variant === "sm" && styles.smVariant,
      isError && baseStyles.error,
      isError && styles.error,
      isError && variant === "underline" && styles.underlineError,
      isError && variant === "text" && styles.textError,
      isDisabled && baseStyles.disabled,
      isDisabled && variant === "underline" && styles.underlineDisabled,
      isDisabled && variant === "text" && styles.textDisabled,
      className,
    );

    return (
      <div className={wrapperClass}>
        <div className={styles.countWrapper}>
          <textarea
            ref={setRefs}
            disabled={isDisabled}
            className={styles.textarea}
            maxLength={maxCount}
            aria-invalid={isError || undefined}
            onInput={handleInput}
            {...(autoResize && { style: { resize: "none", overflow: "hidden" } })}
            {...rest}
          />
          <span className={styles.count}>
            <span className={styles.countCurrent}>{charCount}</span>/{maxCount}
          </span>
        </div>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
