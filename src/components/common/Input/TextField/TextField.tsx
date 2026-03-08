import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";

import Icon from "@/components/common/Icon/Icon";

import baseStyles from "../FormFieldBase.module.scss";
import styles from "./TextField.module.scss";
import type { TextFieldHandle, TextFieldProps } from "./TextField.types";

const TextField = forwardRef<TextFieldHandle, TextFieldProps>(
  (
    {
      variant = "default",
      size = "md",
      status = "default",
      maxCount,
      onClear,
      className,
      disabled,
      onChange,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [charCount, setCharCount] = useState(
      typeof defaultValue === "string" ? defaultValue.length : 0,
    );
    const [isEmpty, setIsEmpty] = useState(
      typeof defaultValue === "string" ? defaultValue.length === 0 : true,
    );

    const isDisabled = disabled || status === "disabled";
    const isSearch = variant === "search";
    const isTitle = variant === "title";
    const isCount = variant === "count";
    const hasCount = (isCount || isSearch || isTitle) && maxCount !== undefined;

    const clearContent = useCallback(() => {
      const el = inputRef.current;
      if (!el) return;

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeInputValueSetter?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));

      setCharCount(0);
      setIsEmpty(true);
      onClear?.();
    }, [onClear]);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        clear: clearContent,
        getElement: () => inputRef.current,
      }),
      [clearContent],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const len = e.target.value.length;
        setCharCount(len);
        setIsEmpty(len === 0);
        onChange?.(e);
      },
      [onChange],
    );

    const wrapperClass = clsx(
      baseStyles.wrapper,
      !isSearch && !isTitle && baseStyles[size],
      isSearch && styles.search,
      isTitle && styles.titleVariant,
      status === "error" && baseStyles.error,
      status === "success" && baseStyles.success,
      isTitle && status === "error" && styles.titleError,
      isTitle && status === "success" && styles.titleSuccess,
      isDisabled && baseStyles.disabled,
      className,
    );

    const inputClass = clsx(
      baseStyles.input,
      isTitle && (size === "sm" ? styles.titleInputSm : styles.titleInputMd),
    );

    return (
      <div className={wrapperClass}>
        {isSearch && (
          <span className={styles.iconLeft}>
            <Icon name="magnifer" size={20} />
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          className={inputClass}
          disabled={isDisabled}
          maxLength={maxCount}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...rest}
        />
        {isSearch && onClear && !isEmpty && (
          <button
            type="button"
            onClick={clearContent}
            className={styles.clearButton}
            aria-label="검색어 지우기"
            tabIndex={-1}
          >
            <Icon name="close-circle-fill" size={24} />
          </button>
        )}
        {hasCount && (
          <div className={styles.count}>
            <span className={styles.currentCount}>{charCount}</span>
            <span className={styles.maxCount}>/{maxCount}</span>
          </div>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
