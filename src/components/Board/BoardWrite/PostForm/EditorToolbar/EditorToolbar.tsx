import { memo, useEffect, useState } from "react";
import type { Editor as TinyMCEEditor } from "tinymce";

import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";

import styles from "./EditorToolbar.module.scss";

interface EditorToolbarProps {
  editor: TinyMCEEditor | null;
  onAddLink: () => void;
  onAddImage: () => void;
}

type PopoverType = "insert" | "heading" | "forecolor" | "hilitecolor";

interface PopoverState {
  type: PopoverType;
  left: number;
  top: number;
}

const COLOR_PRESETS = [
  { value: "#1A1B1E", label: "검정" },
  { value: "#70737E", label: "회색" },
  { value: "#A4A9B7", label: "밝은 회색" },
  { value: "#F04438", label: "빨강" },
  { value: "#FF9F43", label: "주황" },
  { value: "#FFC800", label: "노랑" },
  { value: "#12B76A", label: "초록" },
  { value: "#2E90FA", label: "파랑" },
  { value: "#7A5AF8", label: "보라" },
  { value: "#EE46BC", label: "분홍" },
];

const MENU_POPOVER_WIDTH = 150;
const COLOR_POPOVER_WIDTH = 176;
const VIEWPORT_MARGIN = 8;

const isMenuPopover = (type: PopoverType) => type === "insert" || type === "heading";

// 툴바 버튼이 mousedown 시 포커스를 가로채면 에디터 선택 영역이 풀린다
const keepEditorSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

function EditorToolbar({ editor, onAddLink, onAddImage }: EditorToolbarProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const isPopoverOpen = popover !== null;

  useEffect(() => {
    if (!isPopoverOpen) return;
    const close = () => setPopover(null);
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPopover(null);
      }
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isPopoverOpen]);

  const togglePopover = (type: PopoverType) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (popover?.type === type) {
      setPopover(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const width = isMenuPopover(type) ? MENU_POPOVER_WIDTH : COLOR_POPOVER_WIDTH;
    const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN;
    setPopover({
      type,
      left: Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft)),
      top: rect.bottom + 8,
    });
  };

  const execCommand = (command: string, value?: string) => {
    if (!editor) return;
    editor.execCommand(command, false, value);
    editor.focus();
  };

  const applyColor = (target: "forecolor" | "hilitecolor", color: string | null) => {
    if (!editor) return;
    if (color) {
      editor.formatter.apply(target, { value: color });
    } else {
      editor.formatter.remove(target);
    }
    editor.nodeChanged();
    editor.focus();
    setPopover(null);
  };

  const runAndClose = (action: () => void) => () => {
    setPopover(null);
    action();
  };

  const renderPopoverContent = () => {
    if (!popover) return null;

    if (isMenuPopover(popover.type)) {
      const items =
        popover.type === "insert"
          ? [
              { label: "사진 추가", onClick: runAndClose(onAddImage) },
              { label: "링크 추가", onClick: runAndClose(onAddLink) },
            ]
          : [
              { label: "제목 1", onClick: runAndClose(() => execCommand("FormatBlock", "h1")) },
              { label: "제목 2", onClick: runAndClose(() => execCommand("FormatBlock", "h2")) },
              { label: "본문", onClick: runAndClose(() => execCommand("FormatBlock", "p")) },
            ];

      return (
        <ul className={styles.menuList} role="menu">
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onMouseDown={keepEditorSelection}
                onClick={item.onClick}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      );
    }

    const target = popover.type;
    return (
      <div
        className={styles.colorPanel}
        role="dialog"
        aria-label={target === "forecolor" ? "글자 색 선택" : "글자 배경 색 선택"}
      >
        <div className={styles.colorGrid}>
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.value}
              type="button"
              className={styles.colorSwatch}
              style={{ backgroundColor: color.value }}
              onMouseDown={keepEditorSelection}
              onClick={() => applyColor(target, color.value)}
              aria-label={color.label}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.colorClear}
          onMouseDown={keepEditorSelection}
          onClick={() => applyColor(target, null)}
        >
          기본으로 되돌리기
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={styles.toolbar} role="toolbar" aria-label="서식 도구">
        <div className={styles.group}>
          <IconButton
            variant="normal"
            icon={<Icon name="plus" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={togglePopover("insert")}
            aria-label="추가"
            aria-haspopup="menu"
            aria-expanded={popover?.type === "insert"}
          />
          <IconButton
            variant="normal"
            icon={<Icon name="undo" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={() => execCommand("Undo")}
            aria-label="실행 취소"
          />
          <IconButton
            variant="normal"
            icon={<Icon name="redo" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={() => execCommand("Redo")}
            aria-label="다시 실행"
          />
        </div>
        <span className={styles.divider} aria-hidden />
        <div className={styles.group}>
          <IconButton
            variant="normal"
            icon={<Icon name="head" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={togglePopover("heading")}
            aria-label="제목 스타일"
            aria-haspopup="menu"
            aria-expanded={popover?.type === "heading"}
          />
          <IconButton
            variant="normal"
            icon={<Icon name="bold" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={() => execCommand("Bold")}
            aria-label="굵게"
          />
          <IconButton
            variant="normal"
            icon={<Icon name="italic" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={() => execCommand("Italic")}
            aria-label="기울임"
          />
          <IconButton
            variant="normal"
            icon={<Icon name="underline" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={() => execCommand("Underline")}
            aria-label="밑줄"
          />
          <IconButton
            variant="normal"
            icon={<Icon name="strikeout" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={() => execCommand("Strikethrough")}
            aria-label="취소선"
          />
          <IconButton
            variant="normal"
            icon={<Icon name="fontcolor" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={togglePopover("forecolor")}
            aria-label="글자 색"
            aria-haspopup="dialog"
            aria-expanded={popover?.type === "forecolor"}
          />
          <IconButton
            variant="normal"
            icon={<Icon name="fontbg" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={togglePopover("hilitecolor")}
            aria-label="글자 배경 색"
            aria-haspopup="dialog"
            aria-expanded={popover?.type === "hilitecolor"}
          />
        </div>
        <div className={styles.group}>
          <IconButton
            variant="normal"
            icon={<Icon name="link" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={onAddLink}
            aria-label="링크 추가"
          />
          <IconButton
            variant="normal"
            icon={<Icon name="gallery" size={24} color="gray-bold" />}
            onMouseDown={keepEditorSelection}
            onClick={onAddImage}
            aria-label="사진 추가"
          />
        </div>
      </div>
      {popover && (
        <>
          <div
            className={styles.popoverBackdrop}
            onClick={() => setPopover(null)}
            aria-hidden="true"
          />
          <div className={styles.popover} style={{ left: popover.left, top: popover.top }}>
            {renderPopoverContent()}
          </div>
        </>
      )}
    </>
  );
}

export default memo(EditorToolbar);
