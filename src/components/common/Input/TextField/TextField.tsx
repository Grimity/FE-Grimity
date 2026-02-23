import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";

import Icon from "@/components/common/Icon/Icon";

import baseStyles from "../FormFieldBase.module.scss";
import styles from "./TextField.module.scss";
import type {
  MentionItem,
  MentionTextFieldHandle,
  TextFieldProps,
  TextFieldRef,
} from "./TextField.types";

// ============================================
// Internal MentionField component
// ============================================

interface MentionFieldProps {
  placeholder?: string;
  disabled?: boolean;
  status?: "default" | "error" | "success" | "disabled";
  size?: "md" | "sm";
  className?: string;
  onMentionSearch?: (query: string | null) => void;
  onChange?: (value: string, mentionIds: string[]) => void;
}

const MentionField = forwardRef<MentionTextFieldHandle, MentionFieldProps>(
  ({ placeholder, disabled, status = "default", size = "md", className, onMentionSearch, onChange }, ref) => {
    const editableRef = useRef<HTMLDivElement>(null);
    const isMentionMode = useRef(false);
    const [isEmpty, setIsEmpty] = useState(true);

    const isDisabled = disabled || status === "disabled";

    const getIsEmpty = useCallback(() => {
      const el = editableRef.current;
      if (!el) return true;
      return [...el.childNodes].every((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return (node.textContent?.replace(/\u200B/g, "") ?? "").length === 0;
        }
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).dataset.mentionId) {
          return false;
        }
        return true;
      });
    }, []);

    const triggerChange = useCallback(() => {
      const el = editableRef.current;
      if (!el || !onChange) return;

      let text = "";
      const mentionIds: string[] = [];

      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent?.replace(/\u200B/g, "") ?? "";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const spanEl = node as HTMLElement;
          if (spanEl.dataset.mentionId) {
            text += spanEl.textContent ?? "";
            mentionIds.push(spanEl.dataset.mentionId);
          }
        }
      });

      onChange(text, mentionIds);
    }, [onChange]);

    const getPrevMentionSpan = useCallback((): HTMLElement | null => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return null;
      const range = sel.getRangeAt(0);
      if (!range.collapsed) return null;

      let candidate: Node | null = null;

      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        if (range.startOffset === 0) {
          candidate = range.startContainer.previousSibling;
        } else if (range.startOffset === 1 && range.startContainer.textContent === "\u200B") {
          candidate = range.startContainer.previousSibling;
        }
      } else if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
        if (range.startOffset > 0) {
          candidate = (range.startContainer as Element).childNodes[range.startOffset - 1];
        }
      }

      if (candidate && candidate.nodeType === Node.ELEMENT_NODE && (candidate as HTMLElement).dataset.mentionId) {
        return candidate as HTMLElement;
      }
      return null;
    }, []);

    const insertMention = useCallback(
      (mention: MentionItem) => {
        const el = editableRef.current;
        if (!el) return;

        const span = document.createElement("span");
        span.contentEditable = "false";
        span.dataset.mentionId = mention.id;
        span.className = styles.mentionChip;
        span.textContent = `@${mention.name}`;

        const sel = window.getSelection();
        const hasSelectionInEl = sel && sel.rangeCount && el.contains(sel.getRangeAt(0).startContainer);

        if (hasSelectionInEl && isMentionMode.current) {
          const range = sel.getRangeAt(0);
          const textNode = range.startContainer as Text;

          if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent ?? "";
            const beforeCursor = text.slice(0, range.startOffset);
            const atIndex = beforeCursor.lastIndexOf("@");

            if (atIndex !== -1) {
              const parent = textNode.parentNode!;
              const nextSibling = textNode.nextSibling;
              const afterCursor = text.slice(range.startOffset);

              textNode.textContent = text.slice(0, atIndex);

              const afterNode = document.createTextNode(afterCursor || "\u200B");
              parent.insertBefore(afterNode, nextSibling);
              parent.insertBefore(span, afterNode);

              const newRange = document.createRange();
              newRange.setStart(afterNode, afterCursor ? 0 : 1);
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);

              isMentionMode.current = false;
              onMentionSearch?.(null);
              setIsEmpty(false);
              triggerChange();
              return;
            }
          }
        }

        // Fallback: append at end of element
        const zwsNode = document.createTextNode("\u200B");
        el.appendChild(span);
        el.appendChild(zwsNode);

        isMentionMode.current = false;
        onMentionSearch?.(null);
        setIsEmpty(false);
        triggerChange();
      },
      [onMentionSearch, triggerChange],
    );

    useImperativeHandle(
      ref,
      () => ({
        insertMention,
        focus: () => editableRef.current?.focus(),
        getElement: () => editableRef.current,
      }),
      [insertMention],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          return;
        }

        if (e.key === "Backspace") {
          const mentionSpan = getPrevMentionSpan();
          if (mentionSpan) {
            e.preventDefault();
            mentionSpan.parentNode?.removeChild(mentionSpan);
            setIsEmpty(getIsEmpty());
            triggerChange();
            return;
          }

          // Exit mention mode when cursor is right after @
          if (isMentionMode.current) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount) {
              const range = sel.getRangeAt(0);
              if (range.startContainer.nodeType === Node.TEXT_NODE) {
                const before = (range.startContainer.textContent ?? "").slice(0, range.startOffset);
                const atIdx = before.lastIndexOf("@");
                if (atIdx !== -1 && before.slice(atIdx + 1).length === 0) {
                  isMentionMode.current = false;
                  onMentionSearch?.(null);
                }
              }
            }
          }
          return;
        }

        if ((e.key === " " || e.key === "Escape") && isMentionMode.current) {
          isMentionMode.current = false;
          onMentionSearch?.(null);
        }
      },
      [getPrevMentionSpan, getIsEmpty, onMentionSearch, triggerChange],
    );

    const handleInput = useCallback(() => {
      const empty = getIsEmpty();
      setIsEmpty(empty);

      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) {
        triggerChange();
        return;
      }

      const range = sel.getRangeAt(0);

      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const textContent = range.startContainer.textContent ?? "";
        const beforeCursor = textContent.slice(0, range.startOffset);
        const atIndex = beforeCursor.lastIndexOf("@");

        if (atIndex !== -1) {
          const query = beforeCursor.slice(atIndex + 1);
          if (!query.includes(" ") && !query.includes("\n")) {
            isMentionMode.current = true;
            onMentionSearch?.(query);
            triggerChange();
            return;
          }
        }
      }

      if (isMentionMode.current) {
        isMentionMode.current = false;
        onMentionSearch?.(null);
      }

      triggerChange();
    }, [getIsEmpty, onMentionSearch, triggerChange]);

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");

        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        setIsEmpty(getIsEmpty());
        triggerChange();
      },
      [getIsEmpty, triggerChange],
    );

    const wrapperClass = clsx(
      baseStyles.wrapper,
      baseStyles[size],
      status === "error" && baseStyles.error,
      status === "success" && baseStyles.success,
      isDisabled && baseStyles.disabled,
      className,
    );

    const editableClass = clsx(styles.editable, size === "sm" ? styles.editableSm : styles.editableMd);

    return (
      <div className={wrapperClass}>
        <div
          ref={editableRef}
          className={editableClass}
          contentEditable={isDisabled ? "false" : "true"}
          suppressContentEditableWarning
          data-placeholder={placeholder}
          data-empty={isEmpty ? "true" : undefined}
          role="textbox"
          aria-multiline="false"
          tabIndex={isDisabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onPaste={handlePaste}
        />
      </div>
    );
  },
);

MentionField.displayName = "MentionField";

// ============================================
// TextField (main export)
// ============================================

const TextField = forwardRef<TextFieldRef, TextFieldProps>((props, ref) => {
  if (props.variant === "mention") {
    const { variant: _variant, ...mentionProps } = props;
    return (
      <MentionField
        {...mentionProps}
        ref={ref as React.Ref<MentionTextFieldHandle>}
      />
    );
  }

  const {
    variant = "default",
    size = "md",
    status = "default",
    currentCount,
    maxCount,
    onClear,
    className,
    disabled,
    ...rest
  } = props;

  const isDisabled = disabled || status === "disabled";
  const isSearch = variant === "search";
  const isTitle = variant === "title";
  const isCount = variant === "count";
  const hasCount = (isCount || isSearch || isTitle) && currentCount !== undefined && maxCount !== undefined;

  const wrapperClass = clsx(
    baseStyles.wrapper,
    // Size: search/title have their own sizing
    !isSearch && !isTitle && baseStyles[size],
    // Variant-specific
    isSearch && styles.search,
    isTitle && styles.titleVariant,
    // Status
    status === "error" && baseStyles.error,
    status === "success" && baseStyles.success,
    isTitle && status === "error" && styles.titleError,
    isTitle && status === "success" && styles.titleSuccess,
    isDisabled && baseStyles.disabled,
    className,
  );

  return (
    <div className={wrapperClass}>
      {isSearch && (
        <span className={styles.iconLeft}>
          <Icon name="magnifer" size={20} />
        </span>
      )}
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        disabled={isDisabled}
        className={clsx(baseStyles.input, (isTitle || isSearch) && styles.input)}
        aria-invalid={status === "error" || undefined}
        {...rest}
      />
      {isSearch && onClear && Boolean(rest.value) && (
        <button
          type="button"
          onClick={onClear}
          className={styles.clearButton}
          aria-label="검색어 지우기"
          tabIndex={-1}
        >
          <Icon name="close-circle-fill" size={24} />
        </button>
      )}
      {hasCount && (
        <div className={styles.count}>
          <span className={styles.currentCount}>{currentCount}</span>
          <span className={styles.maxCount}>/{maxCount}</span>
        </div>
      )}
    </div>
  );
});

TextField.displayName = "TextField";

export default TextField;
