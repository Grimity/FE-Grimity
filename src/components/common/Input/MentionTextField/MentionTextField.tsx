import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";

import baseStyles from "../FormFieldBase.module.scss";
import styles from "./MentionTextField.module.scss";
import type {
  MentionItem,
  MentionTextFieldHandle,
  MentionTextFieldProps,
} from "./MentionTextField.types";

const ZWS_REGEX = /\u200B/g;

const MentionTextField = forwardRef<MentionTextFieldHandle, MentionTextFieldProps>(
  (
    {
      size = "md",
      status = "default",
      placeholder,
      disabled,
      defaultValue,
      className,
      maxCount,
      mentionItems,
      onMentionSelect,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
    },
    ref,
  ) => {
    const editableRef = useRef<HTMLDivElement>(null);
    const isMentionMode = useRef(false);
    const isComposing = useRef(false);
    const lastValidHTML = useRef("");
    const [isEmpty, setIsEmpty] = useState(!defaultValue);
    const [charCount, setCharCount] = useState(defaultValue?.length ?? 0);
    const [query, setQuery] = useState<string | null>(null);
    const defaultValueApplied = useRef(false);

    const isDisabled = disabled || status === "disabled";

    const filtered =
      query !== null
        ? mentionItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    useEffect(() => {
      if (defaultValueApplied.current || !defaultValue || !editableRef.current) return;
      defaultValueApplied.current = true;
      editableRef.current.textContent = defaultValue;
      lastValidHTML.current = editableRef.current.innerHTML;
      setIsEmpty(false);
      setCharCount(defaultValue.length);
    }, [defaultValue]);

    const getIsEmpty = useCallback(() => {
      const el = editableRef.current;
      if (!el) return true;
      return [...el.childNodes].every((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return (node.textContent?.replace(ZWS_REGEX, "") ?? "").length === 0;
        }
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).dataset.mentionId) {
          return false;
        }
        return true;
      });
    }, []);

    const getTextContent = useCallback(() => {
      const el = editableRef.current;
      if (!el) return { text: "", mentionIds: [] as string[] };

      let text = "";
      const mentionIds: string[] = [];

      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent?.replace(ZWS_REGEX, "") ?? "";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const spanEl = node as HTMLElement;
          if (spanEl.dataset.mentionId) {
            text += spanEl.textContent ?? "";
            mentionIds.push(spanEl.dataset.mentionId);
          }
        }
      });

      return { text, mentionIds };
    }, []);

    const placeCursorAtEnd = useCallback(() => {
      const el = editableRef.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }, []);

    const restoreLastValid = useCallback(() => {
      const el = editableRef.current;
      if (!el) return;
      el.innerHTML = lastValidHTML.current;
      placeCursorAtEnd();
      const { text, mentionIds } = getTextContent();
      setCharCount(text.length);
      setIsEmpty(text.length === 0);
      onChange?.(text, mentionIds);
    }, [getTextContent, onChange, placeCursorAtEnd]);

    const triggerChange = useCallback(() => {
      const { text, mentionIds } = getTextContent();
      setCharCount(text.length);
      onChange?.(text, mentionIds);
    }, [onChange, getTextContent]);

    const saveValidState = useCallback(() => {
      const el = editableRef.current;
      if (el) lastValidHTML.current = el.innerHTML;
    }, []);

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

      if (
        candidate &&
        candidate.nodeType === Node.ELEMENT_NODE &&
        (candidate as HTMLElement).dataset.mentionId
      ) {
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
        const hasSelectionInEl =
          sel && sel.rangeCount && el.contains(sel.getRangeAt(0).startContainer);

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
              setQuery(null);
              setIsEmpty(false);
              triggerChange();
              saveValidState();
              onMentionSelect?.(mention);
              return;
            }
          }
        }

        const zwsNode = document.createTextNode("\u200B");
        el.appendChild(span);
        el.appendChild(zwsNode);

        isMentionMode.current = false;
        setQuery(null);
        setIsEmpty(false);
        triggerChange();
        saveValidState();
        onMentionSelect?.(mention);
      },
      [triggerChange, saveValidState, onMentionSelect],
    );

    const clearContent = useCallback(() => {
      const el = editableRef.current;
      if (!el) return;
      el.textContent = "";
      lastValidHTML.current = "";
      setIsEmpty(true);
      setCharCount(0);
      isMentionMode.current = false;
      setQuery(null);
      onChange?.("", []);
    }, [onChange]);

    useImperativeHandle(
      ref,
      () => ({
        insertMention,
        focus: () => editableRef.current?.focus(),
        blur: () => editableRef.current?.blur(),
        clear: clearContent,
        getElement: () => editableRef.current,
      }),
      [insertMention, clearContent],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onKeyDown?.(e);
          return;
        }

        if (
          maxCount !== undefined &&
          !isComposing.current &&
          e.key.length === 1 &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          const { text } = getTextContent();
          if (text.length >= maxCount) {
            e.preventDefault();
            onKeyDown?.(e);
            return;
          }
        }

        if (e.key === "Backspace") {
          const mentionSpan = getPrevMentionSpan();
          if (mentionSpan) {
            e.preventDefault();
            mentionSpan.parentNode?.removeChild(mentionSpan);
            setIsEmpty(getIsEmpty());
            triggerChange();
            saveValidState();
            onKeyDown?.(e);
            return;
          }

          if (isMentionMode.current) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount) {
              const range = sel.getRangeAt(0);
              if (range.startContainer.nodeType === Node.TEXT_NODE) {
                const before = (range.startContainer.textContent ?? "").slice(0, range.startOffset);
                const atIdx = before.lastIndexOf("@");
                if (atIdx !== -1 && before.slice(atIdx + 1).length === 0) {
                  isMentionMode.current = false;
                  setQuery(null);
                }
              }
            }
          }
        }

        if ((e.key === " " || e.key === "Escape") && isMentionMode.current) {
          isMentionMode.current = false;
          setQuery(null);
        }

        onKeyDown?.(e);
      },
      [
        getPrevMentionSpan,
        getIsEmpty,
        getTextContent,
        maxCount,
        triggerChange,
        saveValidState,
        onKeyDown,
      ],
    );

    const handleInput = useCallback(() => {
      const empty = getIsEmpty();
      setIsEmpty(empty);

      if (maxCount !== undefined && !isComposing.current) {
        const { text } = getTextContent();
        if (text.length > maxCount) {
          restoreLastValid();
          return;
        }
      }

      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) {
        triggerChange();
        if (!isComposing.current) saveValidState();
        return;
      }

      const range = sel.getRangeAt(0);

      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const textContent = range.startContainer.textContent ?? "";
        const beforeCursor = textContent.slice(0, range.startOffset);
        const atIndex = beforeCursor.lastIndexOf("@");

        if (atIndex !== -1) {
          const q = beforeCursor.slice(atIndex + 1);
          if (!q.includes(" ") && !q.includes("\n")) {
            isMentionMode.current = true;
            setQuery(q);
            triggerChange();
            if (!isComposing.current) saveValidState();
            return;
          }
        }
      }

      if (isMentionMode.current) {
        isMentionMode.current = false;
        setQuery(null);
      }

      triggerChange();
      if (!isComposing.current) saveValidState();
    }, [getIsEmpty, getTextContent, maxCount, restoreLastValid, triggerChange, saveValidState]);

    const handleCompositionStart = useCallback(() => {
      isComposing.current = true;
    }, []);

    const handleCompositionEnd = useCallback(() => {
      isComposing.current = false;

      if (maxCount !== undefined) {
        const { text } = getTextContent();
        if (text.length > maxCount) {
          restoreLastValid();
          return;
        }
      }

      saveValidState();
      triggerChange();
    }, [getTextContent, maxCount, restoreLastValid, saveValidState, triggerChange]);

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        let text = e.clipboardData.getData("text/plain");

        if (maxCount !== undefined) {
          const { text: currentText } = getTextContent();
          const remaining = maxCount - currentText.length;
          if (remaining <= 0) return;
          text = text.slice(0, remaining);
        }

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
        saveValidState();
      },
      [getIsEmpty, getTextContent, maxCount, triggerChange, saveValidState],
    );

    const wrapperClass = clsx(
      baseStyles.wrapper,
      baseStyles[size],
      status === "error" && baseStyles.error,
      status === "success" && baseStyles.success,
      isDisabled && baseStyles.disabled,
      className,
    );

    const editableClass = clsx(
      styles.editable,
      size === "sm" ? styles.editableSm : styles.editableMd,
    );

    return (
      <div className={styles.container}>
        <div className={wrapperClass}>
          <div
            ref={editableRef}
            id={id}
            className={editableClass}
            contentEditable={isDisabled ? "false" : "true"}
            suppressContentEditableWarning
            data-placeholder={placeholder}
            data-empty={isEmpty ? "true" : undefined}
            role="textbox"
            aria-multiline="false"
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid || undefined}
            tabIndex={isDisabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onPaste={handlePaste}
            onFocus={onFocus}
            onBlur={onBlur}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          {maxCount !== undefined && (
            <div className={styles.count}>
              <span className={styles.currentCount}>{charCount}</span>
              <span className={styles.maxCount}>/{maxCount}</span>
            </div>
          )}
        </div>
        {query !== null && filtered.length > 0 && (
          <div className={styles.dropdown}>
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.dropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(item);
                }}
              >
                @{item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

MentionTextField.displayName = "MentionTextField";

export default MentionTextField;
