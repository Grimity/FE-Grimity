import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./ChatBubble.module.scss";
import type { ChatBubbleProps } from "./ChatBubble.types";

export default function ChatBubble({
  type = "Others",
  state = "Default",
  text = "Hello~",
  replyText,
  replyTarget,
  imageSrc,
  onLike,
  onReply,
  className,
}: ChatBubbleProps) {
  const isMine = type === "Default";
  const isAnswer1 = state === "Answer1";
  const isAnswer2 = state === "Answer2";
  const isAnswer = isAnswer1 || isAnswer2;
  const isImages = state === "images";
  const isSand = state === "Sand";
  const isHeart = state === "Heart";
  const isHovered = state === "Hovered";
  const isRightSlide = state === "RightSlide";

  // Answer 1/2: stacked layout (label + pill row). Alignment differs by type + variant.
  // Answer1 → items-start for Others, items-end for Default
  // Answer2 → items-end for Others, items-start for Default
  if (isAnswer) {
    const alignEnd = (isAnswer1 && isMine) || (isAnswer2 && !isMine);
    const labelText = isMine
      ? "나에게 답장"
      : replyTarget
        ? `${replyTarget}님에게 답장`
        : "[user]님에게 답장";

    return (
      <div
        className={clsx(
          styles.answerWrapper,
          alignEnd ? styles.alignEnd : styles.alignStart,
          className,
        )}
      >
        <span className={clsx(styles.answerLabel, alignEnd && styles.answerLabelEnd)}>
          {labelText}
        </span>
        <div className={styles.answerRow}>
          <Icon name="forward-2" size={16} className={styles.answerReplyIcon} />
          <div className={clsx(styles.answerPill, isMine ? styles.answerPillMine : styles.answerPillOthers)}>
            <p className={styles.answerPillText}>
              {replyText ?? "이 내용을 한줄만 나오게 해주세요"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Images: 300×140 fixed container, no bubble chrome.
  if (isImages) {
    return (
      <div className={clsx(styles.imagesWrapper, className)}>
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt="첨부 이미지" className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <p>가로값 300 고정</p>
            <p>세로값 가변</p>
          </div>
        )}
      </div>
    );
  }

  // Standard bubble variants (Default, Sand, Hovered, Heart, RightSlide).
  const bubble = (
    <div className={clsx(styles.bubble, isMine ? styles.mine : styles.others)}>
      <p className={styles.text}>{text}</p>
      {isHeart && (
        <div
          className={clsx(styles.heartBadge, isMine ? styles.heartBadgeMine : styles.heartBadgeOthers)}
          aria-label="좋아요 표시"
        >
          <Icon name="heart-fill" size={12} className={styles.heartBadgeIcon} />
        </div>
      )}
    </div>
  );

  const actionButtons = (
    <div className={styles.actions}>
      <button type="button" className={styles.actionBtn} onClick={onLike} aria-label="좋아요">
        <Icon name="heart" size={20} />
      </button>
      <button type="button" className={styles.actionBtn} onClick={onReply} aria-label="답장">
        <Icon name="forward-2" size={20} />
      </button>
    </div>
  );

  const slideButton = (
    <button type="button" className={styles.slideBtn} onClick={onReply} aria-label="답장">
      <Icon name="forward-2" size={20} />
    </button>
  );

  const sandIcon = <Icon name="message" size={16} className={styles.sandIcon} />;

  return (
    <div
      className={clsx(
        styles.wrapper,
        isMine && styles.wrapperMine,
        isHeart && styles.wrapperHeart,
        isSand && styles.wrapperSand,
        className,
      )}
    >
      {bubble}

      {/* Accessories appear on the "inside" edge of the bubble (row-reverse on mine
          flips source order so post-bubble items end up on the left visually). */}
      {isHovered && actionButtons}
      {isRightSlide && slideButton}
      {isSand && isMine && sandIcon}
    </div>
  );
}
