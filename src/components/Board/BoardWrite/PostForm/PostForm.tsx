import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import clsx from "clsx";
import { Editor as TinyMCEEditor } from "tinymce";

import Filter from "@/components/common/Filter/Filter";
import TextField from "@/components/common/Input/TextField/TextField";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import GNB from "@/components/common/Navigation/GNB/GNB";
import Loader from "@/components/Layout/Loader/Loader";
import EditorToolbar from "@/components/Board/BoardWrite/PostForm/EditorToolbar/EditorToolbar";
import LinkPopup from "@/components/Board/BoardWrite/PostForm/LinkPopup/LinkPopup";
import UploadingOverlay from "@/components/Board/BoardWrite/PostForm/UploadingOverlay/UploadingOverlay";

import { useDeviceStore } from "@/states/deviceStore";
import { useEditorImageUploader } from "@/hooks/useEditorImageUploader";
import { useToast } from "@/hooks/useToast";
import useGoBack from "@/hooks/useGoBack";
import { stripHtml } from "@/utils/stripHtml";

import type { PostFormProps } from "./PostForm.types";
import styles from "./PostForm.module.scss";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <Loader />,
});

const TITLE_MAX_LENGTH = 32;
const CONTENT_MAX_LENGTH = 500;

const CATEGORY_OPTIONS = [
  { label: "일반", value: "일반" },
  { label: "질문", value: "질문" },
  { label: "피드백", value: "피드백" },
];

const ESCAPE_AMP = /&/g;
const ESCAPE_LT = /</g;
const ESCAPE_GT = />/g;
const ESCAPE_QUOT = /"/g;
const PROTOCOL_PATTERN = /^https?:\/\//i;

const escapeHtml = (text: string) =>
  text
    .replace(ESCAPE_AMP, "&amp;")
    .replace(ESCAPE_LT, "&lt;")
    .replace(ESCAPE_GT, "&gt;")
    .replace(ESCAPE_QUOT, "&quot;");

const EDITOR_CONTENT_STYLE = `
  html {
    height: 100%;
    cursor: text;
  }
  body {
    font-family: Pretendard, sans-serif;
    font-size: 14px;
    margin: 10px 16px;
    outline: none;
  }
  img {
    max-width: 100%;
    height: auto !important;
  }
  h1 {
    margin: 14px 0;
  }
  h2 {
    margin: 14px 0;
  }
  p {
    margin: 6px 0;
  }
`;

export default function PostForm({
  formTitle,
  title,
  onTitleChange,
  content,
  onEditorChange,
  selectedCategory,
  onCategoryClick,
  onSubmit,
  isSubmitting,
  submitButtonText,
}: PostFormProps) {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { goBack } = useGoBack();
  const { showToast } = useToast();
  const { uploadImage } = useEditorImageUploader();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [editor, setEditor] = useState<TinyMCEEditor | null>(null);
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
  const [showUploading, setShowUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionBookmarkRef = useRef<ReturnType<
    TinyMCEEditor["selection"]["getBookmark"]
  > | null>(null);

  useEffect(() => {
    if (window.tinymce) {
      setIsScriptLoaded(true);
    }
  }, []);

  // 업로드가 오래 걸리는 경우에만 로딩 모달 노출
  useEffect(() => {
    if (!isSubmitting) {
      setShowUploading(false);
      return;
    }
    const timer = setTimeout(() => setShowUploading(true), 500);
    return () => clearTimeout(timer);
  }, [isSubmitting]);

  const contentLength = useMemo(() => stripHtml(content).trim().length, [content]);
  const hasImage = content.includes("<img");
  const isOverLength = contentLength > CONTENT_MAX_LENGTH;
  const disabled =
    !title.trim() || (contentLength === 0 && !hasImage) || isOverLength || isSubmitting;

  const handleAddImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!editor || files.length === 0) return;

    for (const file of files) {
      try {
        const url = await uploadImage({ filename: () => file.name, blob: () => file });
        editor.insertContent(`<img src="${url}" alt="" />`);
      } catch {
        showToast("이미지 업로드에 실패했습니다.", "error");
      }
    }
  };

  const handleAddLink = useCallback(() => {
    if (!editor) return;
    selectionBookmarkRef.current = editor.selection.getBookmark(2, true);
    setIsLinkPopupOpen(true);
  }, [editor]);

  const handleLinkSubmit = (rawUrl: string, rawLabel: string) => {
    if (!editor) return;

    const url = PROTOCOL_PATTERN.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const label = rawLabel || rawUrl;

    editor.focus();
    if (selectionBookmarkRef.current) {
      editor.selection.moveToBookmark(selectionBookmarkRef.current);
    }
    editor.insertContent(
      `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`,
    );
    setIsLinkPopupOpen(false);
  };

  return (
    <div className={styles.page}>
      <Script
        src="https://public.grimity.com/tinymce/tinymce.min.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      {isMobile && (
        <GNB
          variant="text-button"
          title={formTitle}
          onBack={goBack}
          rightLabel={submitButtonText}
          onRightLabelClick={onSubmit}
          rightLabelDisabled={disabled}
        />
      )}
      <div className={styles.content}>
        {!isMobile && <h2 className={styles.pageTitle}>{formTitle}</h2>}
        <div className={styles.formSection}>
          <div className={styles.fields}>
            <div className={styles.searchRow}>
              <Filter
                options={CATEGORY_OPTIONS}
                value={selectedCategory}
                onChange={onCategoryClick}
                align="left"
                displayMode={isMobile ? "bottomSheet" : "menu"}
                bottomSheetTitle="말머리 선택"
                className={styles.categoryFilter}
              />
              <TextField
                className={styles.titleField}
                variant="count"
                size="sm"
                maxCount={TITLE_MAX_LENGTH}
                placeholder="제목을 입력하세요"
                name="title"
                autoComplete="off"
                value={title}
                onChange={onTitleChange}
                aria-label="제목"
              />
            </div>
            <div className={styles.editorBox}>
              <EditorToolbar editor={editor} onAddLink={handleAddLink} onAddImage={handleAddImage} />
              <div className={styles.editorArea}>
                {isScriptLoaded ? (
                  <Editor
                    licenseKey="gpl"
                    onInit={(_, ed) => setEditor(ed)}
                    init={{
                      height: "100%",
                      menubar: false,
                      toolbar: false,
                      statusbar: false,
                      plugins: ["autolink"],
                      placeholder: "내용을 입력해주세요",
                      content_style: EDITOR_CONTENT_STYLE,
                      base_url: "https://public.grimity.com/tinymce",
                      skin_url: "https://public.grimity.com/tinymce/skins/ui/oxide",
                      icons_url: "https://public.grimity.com/tinymce/icons/default/icons.js",
                      indent: false,
                      relative_urls: false,
                      remove_script_host: false,
                      default_link_target: "_blank",
                      paste_data_images: true,
                      automatic_uploads: true,
                      images_upload_handler: uploadImage,
                      setup: (ed) => {
                        ed.on("keydown", (event) => {
                          if (event.key === "Tab") {
                            event.preventDefault();
                            ed.execCommand("mceInsertContent", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
                          }
                        });
                      },
                    }}
                    value={content}
                    onEditorChange={onEditorChange}
                  />
                ) : (
                  <Loader />
                )}
              </div>
              <div className={styles.countRow}>
                <p className={styles.errorMessage} role="alert">
                  {isOverLength ? `내용은 ${CONTENT_MAX_LENGTH}자까지 입력할 수 있어요` : ""}
                </p>
                <span className={styles.countGroup}>
                  <span className={clsx(styles.currentCount, isOverLength && styles.countError)}>
                    {contentLength}
                  </span>
                  <span className={styles.maxCount}>/{CONTENT_MAX_LENGTH}</span>
                </span>
              </div>
            </div>
          </div>
          {!isMobile && (
            <SolidButton
              size="large"
              className={styles.submitButton}
              onClick={onSubmit}
              disabled={disabled}
            >
              {submitButtonText}
            </SolidButton>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
      />
      <LinkPopup
        isOpen={isLinkPopupOpen}
        onClose={() => setIsLinkPopupOpen(false)}
        onSubmit={handleLinkSubmit}
      />
      {showUploading && <UploadingOverlay />}
    </div>
  );
}
