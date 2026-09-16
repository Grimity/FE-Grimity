import clsx from "clsx";

import Icon from "@/components/common/Icon/Icon";

import { formatReplyLabel } from "@/utils/formatReplyLabel";

import styles from "./ChatBubble.module.scss";
import type { ChatBubbleProps } from "./ChatBubble.types";

const SAND_ICON = <Icon name="message" size={16} className={styles.sandIcon} />;

export default function ChatBubble({
  variant = "others",
  messageId,
  text,
  images,
  replyTo,
  isLiked = false,
  isHovered = false,
  isPending = false,
  showSlide = false,
  onLike,
  onReply,
  onReplyClick,
  onImageClick,
  onMouseEnter,
  onMouseLeave,
  className,
}: ChatBubbleProps) {
  const isMine = variant === "mine";
  const hasImages = !!images && images.length > 0;
  const hasText = !!text;
  const isQuotingMine = replyTo?.target === "나";

  const activateOnKey = (action: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      action();
    }
  };

  const hoverActions = isHovered ? (
    <div className={styles.actions}>
      <button
        type="button"
        className={clsx(styles.actionBtn, isLiked && styles.actionBtnLiked)}
        onClick={onLike}
        aria-label="좋아요"
      >
        <Icon name={isLiked ? "heart-fill" : "heart"} size={20} />
      </button>
      <button type="button" className={styles.actionBtn} onClick={onReply} aria-label="답장">
        <Icon name="forward-2" size={20} />
      </button>
    </div>
  ) : null;

  const heartBadge = isLiked ? (
    <div
      className={clsx(styles.heartBadge, isMine ? styles.heartBadgeMine : styles.heartBadgeOthers)}
      aria-label="좋아요 표시"
    >
      <Icon name="heart-fill" size={12} className={styles.heartBadgeIcon} />
    </div>
  ) : null;

  return (
    <div
      data-message-id={messageId}
      className={clsx(
        styles.container,
        isMine ? styles.containerMine : styles.containerOthers,
        className,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {replyTo ? (
        <div
          className={clsx(
            styles.answerWrapper,
            isMine ? styles.alignEnd : styles.alignStart,
          )}
        >
          <span className={clsx(styles.answerLabel, isMine && styles.answerLabelEnd)}>
            {formatReplyLabel(replyTo.target)}
          </span>
          <div
            className={clsx(styles.answerRow, onReplyClick && styles.answerRowClickable)}
            onClick={
              onReplyClick
                ? (e) => {
                    e.stopPropagation();
                    onReplyClick();
                  }
                : undefined
            }
            onKeyDown={onReplyClick ? activateOnKey(onReplyClick) : undefined}
            role={onReplyClick ? "button" : undefined}
            tabIndex={onReplyClick ? 0 : undefined}
          >
            <Icon name="forward-2" size={16} className={styles.answerReplyIcon} />
            <div
              className={clsx(
                styles.answerPill,
                isQuotingMine ? styles.answerPillMine : styles.answerPillOthers,
              )}
            >
              <p className={styles.answerPillText}>{replyTo.text}</p>
            </div>
          </div>
        </div>
      ) : null}

      {hasImages ? (
        <div
          className={clsx(
            styles.wrapper,
            styles.wrapperImage,
            isMine && styles.wrapperMine,
            isLiked && !hasText && styles.wrapperImageHeart,
          )}
        >
          <div className={clsx(styles.imageGrid, styles[`grid${Math.min(images!.length, 5)}`])}>
            {images!.map((src, idx) => (
              <div key={`${src}-${idx}`} className={styles.imageCell}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="첨부 이미지"
                  className={clsx(styles.image, onImageClick && styles.imageClickable)}
                  onClick={
                    onImageClick
                      ? (e) => {
                          e.stopPropagation();
                          onImageClick(idx);
                        }
                      : undefined
                  }
                  onKeyDown={onImageClick ? activateOnKey(() => onImageClick(idx)) : undefined}
                  role={onImageClick ? "button" : undefined}
                  tabIndex={onImageClick ? 0 : undefined}
                />
              </div>
            ))}
          </div>
          {!hasText && heartBadge}
          {!hasText && hoverActions}
        </div>
      ) : null}

      {hasText ? (
        <div
          className={clsx(
            styles.wrapper,
            isMine && styles.wrapperMine,
            isLiked && styles.wrapperHeart,
            isPending && styles.wrapperSand,
          )}
        >
          <div className={clsx(styles.bubble, isMine ? styles.mine : styles.others)}>
            <p className={styles.text}>{text}</p>
            {heartBadge}
          </div>

          {hoverActions}

          {showSlide ? (
            <button
              type="button"
              className={styles.slideBtn}
              onClick={onReply}
              aria-label="답장"
            >
              <Icon name="forward-2" size={20} />
            </button>
          ) : null}

          {isPending && isMine ? SAND_ICON : null}
        </div>
      ) : null}
    </div>
  );
}
