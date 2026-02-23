import { forwardRef, useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import baseStyles from "../FormFieldBase.module.scss";
import styles from "./TextArea.module.scss";
import { TextAreaProps } from "./TextArea.types";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = "default",
      status = "default",
      currentCount,
      maxCount,
      autoResize = false,
      className,
      disabled,
      onInput,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const isDisabled = disabled || status === "disabled";
    const hasCount = currentCount !== undefined && maxCount !== undefined;

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
      adjustHeight();
      onInput?.(e);
    };

    const setRefs = (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
      }
    };

    const wrapperClass = clsx(
      baseStyles.wrapper,
      styles.wrapper,
      variant === "underline" && styles.underline,
      variant === "text" && styles.text,
      variant === "sm" && styles.smVariant,
      status === "error" && baseStyles.error,
      isDisabled && baseStyles.disabled,
      className
    );

    return (
      <div className={wrapperClass}>
        <div className={styles.countWrapper}>
          <textarea
            ref={setRefs}
            disabled={isDisabled}
            className={styles.textarea}
            aria-invalid={status === "error" || undefined}
            onInput={handleInput}
            {...(autoResize && { style: { resize: "none", overflow: "hidden" } })}
            {...rest}
          />
          {hasCount && (
            <span
              className={clsx(
                styles.count,
                status === "error" && styles.countError
              )}
            >
              {currentCount}/{maxCount}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
