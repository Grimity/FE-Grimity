import { useState, useRef, KeyboardEvent } from "react";
import clsx from "clsx";
import Tag from "../Tag/Tag";
import styles from "./TagSelect.module.scss";
import { TagSelectProps } from "./TagSelect.types";

export default function TagSelect({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = "태그 추가",
  maxTags,
  size = "md",
  className,
  ...props
}: TagSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = maxTags !== undefined && tags.length >= maxTags;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if ((e.key === "Enter" || e.key === " ") && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onRemoveTag(tags.length - 1);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={clsx(styles.container, styles[size], className)}
      onClick={handleContainerClick}
      {...props}
    >
      {tags.map((tag, index) => (
        <Tag
          key={index}
          size={size}
          active
          onRemove={() => onRemoveTag(index)}
        >
          {tag}
        </Tag>
      ))}
      {!isFull && (
        <div className={styles.inputWrapper}>
          <span className={styles.prefix}>#</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
          />
        </div>
      )}
    </div>
  );
}
