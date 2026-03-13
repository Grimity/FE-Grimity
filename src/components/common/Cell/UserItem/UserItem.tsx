import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import RadioButton from "@/components/common/Control/RadioButton/RadioButton";
import Bookmark from "@/components/common/Control/Bookmark/Bookmark";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import NumberBadge from "@/components/common/PushBadge/NumberBadge/NumberBadge";
import Divider from "@/components/common/Divider/Divider";
import UserInfo from "../UserInfo/UserInfo";
import styles from "./UserItem.module.scss";
import { UserItemProps } from "./UserItem.types";

// ============================================
// Avatar sub-component
// ============================================

interface AvatarProps {
  size?: "md" | "xs";
  image?: string;
}

function Avatar({ size = "md", image }: AvatarProps) {
  const sizeClass = size === "md" ? styles.avatarMd : styles.avatarXs;
  const iconSize = size === "md" ? 20 : 16;

  return (
    <div className={sizeClass}>
      {image ? (
        <img src={image} alt="" className={styles.avatarImage} />
      ) : (
        <Icon name="person" size={iconSize} color="gray-subtler" />
      )}
    </div>
  );
}

// ============================================
// UserItem component
// ============================================

export default function UserItem({
  type = "default",
  className,
  children,
  profileImage,
  nickname,
  userId,
  followerCount,
  followingCount,
  selected = false,
  category,
  message,
  time,
  onClose,
  brandIcon,
  siteName,
  url,
  tag,
  showTag = false,
  postTitle,
  body,
  commentCount,
  thumbnailUrl,
  bookmarkActive = false,
  onBookmarkClick,
  heartCount,
  viewCount,
  timeCount,
  chattingCount,
  commentText,
  mentionName,
  likeCount,
  isAuthor,
  onLikeClick,
  onReplyClick,
  onMenuClick,
  onClick,
}: UserItemProps) {
  // ------------------------------------------
  // default
  // ------------------------------------------
  if (type === "default") {
    return (
      <div className={clsx(styles.default, className)} onClick={onClick}>
        <div className={styles.defaultLeft}>
          <Avatar size="md" image={profileImage} />
          <span className={styles.defaultNickname}>{nickname}</span>
        </div>
        {children && <div className={styles.defaultRight}>{children}</div>}
      </div>
    );
  }

  // ------------------------------------------
  // id
  // ------------------------------------------
  if (type === "id") {
    return (
      <div className={clsx(styles.id, className)} onClick={onClick}>
        <div className={styles.idLeft}>
          <Avatar size="md" image={profileImage} />
          <div className={styles.idInfo}>
            <span className={styles.idNickname}>{nickname}</span>
            {userId && <span className={styles.idUserId}>@{userId}</span>}
          </div>
        </div>
        {children && <div className={styles.idRight}>{children}</div>}
      </div>
    );
  }

  // ------------------------------------------
  // iconId
  // ------------------------------------------
  if (type === "iconId") {
    return (
      <div className={clsx(styles.id, className)} onClick={onClick}>
        <div className={styles.idLeft}>
          <Avatar size="md" image={profileImage} />
          <div className={styles.idInfo}>
            <span className={styles.idNickname}>{nickname}</span>
            {userId && <span className={styles.idUserId}>@{userId}</span>}
          </div>
        </div>
        {children && <div className={styles.idRight}>{children}</div>}
      </div>
    );
  }

  // ------------------------------------------
  // radio
  // ------------------------------------------
  if (type === "radio") {
    return (
      <div className={clsx(styles.radio, className)} onClick={onClick}>
        <div className={styles.radioLeft}>
          <Avatar size="md" image={profileImage} />
          <div className={styles.idInfo}>
            <span className={styles.idNickname}>{nickname}</span>
            {userId && <span className={styles.idUserId}>@{userId}</span>}
          </div>
        </div>
        <RadioButton selected={selected} />
      </div>
    );
  }

  // ------------------------------------------
  // follow
  // ------------------------------------------
  if (type === "follow") {
    return (
      <div className={clsx(styles.follow, className)} onClick={onClick}>
        <div className={styles.followLeft}>
          <Avatar size="md" image={profileImage} />
          <div className={styles.followInfo}>
            <span className={styles.followNickname}>{nickname}</span>
            <UserInfo
              type="follow"
              followerCount={followerCount}
              followingCount={followingCount}
            />
          </div>
        </div>
        {children && <div className={styles.followRight}>{children}</div>}
      </div>
    );
  }

  // ------------------------------------------
  // notification
  // ------------------------------------------
  if (type === "notification") {
    return (
      <div className={clsx(styles.notification, className)}>
        <div className={styles.notificationLeft}>
          <div className={styles.notificationContent}>
            {category && (
              <span className={styles.notificationCategory}>{category}</span>
            )}
            {message && (
              <span className={styles.notificationMessage}>{message}</span>
            )}
          </div>
          {time && <span className={styles.notificationTime}>{time}</span>}
        </div>
        <IconButton
          variant="sm"
          icon={<Icon name="x" size={16} />}
          onClick={onClose}
          aria-label="알림 삭제"
        />
      </div>
    );
  }

  // ------------------------------------------
  // link
  // ------------------------------------------
  if (type === "link") {
    return (
      <div className={clsx(styles.link, className)} onClick={onClick}>
        <div className={styles.linkLeft}>
          {brandIcon && (
            <div className={styles.linkBrandIcon}>{brandIcon}</div>
          )}
          <div className={styles.linkInfo}>
            {siteName && (
              <span className={styles.linkSiteName}>{siteName}</span>
            )}
            {url && <span className={styles.linkUrl}>{url}</span>}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // linkMain
  // ------------------------------------------
  if (type === "linkMain") {
    return (
      <div className={clsx(styles.linkMain, className)} onClick={onClick}>
        {brandIcon && (
          <div className={styles.linkMainBrandIcon}>{brandIcon}</div>
        )}
        {siteName && (
          <span className={styles.linkMainSiteName}>{siteName}</span>
        )}
      </div>
    );
  }

  // ------------------------------------------
  // bookMark
  // ------------------------------------------
  if (type === "bookMark") {
    return (
      <div className={clsx(styles.bookMark, className)} onClick={onClick}>
        <div className={styles.bookMarkLeft}>
          <div className={styles.bookMarkPost}>
            <div className={styles.bookMarkHeader}>
              {showTag && tag && (
                <span className={styles.tagAssistive}>{tag}</span>
              )}
              <span className={styles.bookMarkGalleryIcon}>
                <Icon name="gallery" size={16} color="gray-subtle" />
              </span>
              <span className={styles.bookMarkTitle}>{postTitle}</span>
              {commentCount !== undefined && commentCount > 0 && (
                <NumberBadge count={commentCount} variant="outline" />
              )}
            </div>
            {body && <p className={styles.bookMarkBody}>{body}</p>}
          </div>
          <UserInfo
            type="default"
            nickname={nickname}
            showHeart={!!heartCount}
            heartCount={heartCount}
            showView={!!viewCount}
            viewCount={viewCount}
            showTime={!!timeCount}
            timeCount={timeCount}
          />
        </div>
        <Bookmark active={bookmarkActive} onClick={onBookmarkClick} />
        <div className={styles.bookMarkDivider}>
          <Divider />
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // communityTitle
  // ------------------------------------------
  if (type === "communityTitle") {
    return (
      <div
        className={clsx(styles.communityTitle, className)}
        onClick={onClick}
      >
        <div className={styles.communityTitlePost}>
          <div className={styles.communityTitleHeader}>
            {showTag && tag && (
              <span className={styles.tagAssistive}>{tag}</span>
            )}
            <span className={styles.communityTitleText}>{postTitle}</span>
            {commentCount !== undefined && commentCount > 0 && (
              <NumberBadge count={commentCount} variant="outline" />
            )}
          </div>
          {body && <p className={styles.communityTitleBody}>{body}</p>}
        </div>
        <UserInfo
          type="default"
          nickname={nickname}
          showHeart={!!heartCount}
          heartCount={heartCount}
          showView={!!viewCount}
          viewCount={viewCount}
          showTime={!!timeCount}
          timeCount={timeCount}
        />
        <div className={styles.communityTitleDivider}>
          <Divider />
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // title
  // ------------------------------------------
  if (type === "title") {
    return (
      <div className={clsx(styles.title, className)} onClick={onClick}>
        <div className={styles.titleHeader}>
          {showTag && tag && (
            <span className={styles.tagPrimary}>{tag}</span>
          )}
          <span className={styles.titleText}>{postTitle}</span>
        </div>
        <UserInfo
          type="community"
          nickname={nickname}
          showHeart={!!heartCount}
          heartCount={heartCount}
          showView={!!viewCount}
          viewCount={viewCount}
          showTime={!!timeCount}
          timeCount={timeCount}
          showChatting={!!chattingCount}
          chattingCount={chattingCount}
        />
        <div className={styles.titleDivider}>
          <Divider />
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // image
  // ------------------------------------------
  if (type === "image") {
    return (
      <div className={clsx(styles.image, className)} onClick={onClick}>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt=""
            className={styles.imageThumbnail}
          />
        )}
        <div className={styles.imageRight}>
          <span className={styles.imageTitle}>{postTitle}</span>
          <UserInfo
            type="community"
            nickname={nickname}
            showHeart={!!heartCount}
            heartCount={heartCount}
            showView={!!viewCount}
            viewCount={viewCount}
            showTime={!!timeCount}
            timeCount={timeCount}
            showChatting={!!chattingCount}
            chattingCount={chattingCount}
          />
        </div>
        <div className={styles.imageDivider}>
          <Divider />
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // comment
  // ------------------------------------------
  if (type === "comment") {
    return (
      <div className={clsx(styles.comment, className)}>
        <div className={styles.commentContainer}>
          <div className={styles.commentHeader}>
            <div className={styles.commentHeaderLeft}>
              <Avatar size="md" image={profileImage} />
              <UserInfo
                type="comment"
                nickname={nickname}
                showTag={isAuthor}
                showTime={!!timeCount}
                timeCount={timeCount}
              />
            </div>
            <IconButton
              variant="sm"
              icon={<Icon name="dotmenu" size={16} />}
              onClick={onMenuClick}
              aria-label="메뉴"
            />
          </div>
          {commentText && (
            <p className={clsx(styles.commentContent, styles.commentContentMd)}>
              {commentText}
            </p>
          )}
        </div>
        <div className={clsx(styles.commentActions, styles.commentActionsMd)}>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onLikeClick}
          >
            <Icon name="heart" size={16} color="gray-subtle" />
            {likeCount}
          </button>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onReplyClick}
          >
            <Icon name="chat-round" size={16} color="gray-subtle" />
            답글달기
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // commentxs
  // ------------------------------------------
  if (type === "commentxs") {
    return (
      <div className={clsx(styles.comment, className)}>
        <div className={styles.commentContainer}>
          <div className={styles.commentHeader}>
            <div className={styles.commentHeaderLeft}>
              <Avatar size="xs" image={profileImage} />
              <UserInfo
                type="comment"
                nickname={nickname}
                showTag={isAuthor}
                showTime={!!timeCount}
                timeCount={timeCount}
              />
            </div>
            <IconButton
              variant="sm"
              icon={<Icon name="dotmenu" size={16} />}
              onClick={onMenuClick}
              aria-label="메뉴"
            />
          </div>
          {commentText && (
            <p className={clsx(styles.commentContent, styles.commentContentXs)}>
              {commentText}
            </p>
          )}
        </div>
        <div className={clsx(styles.commentActions, styles.commentActionsXs)}>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onLikeClick}
          >
            <Icon name="heart" size={16} color="gray-subtle" />
            {likeCount}
          </button>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onReplyClick}
          >
            <Icon name="chat-round" size={16} color="gray-subtle" />
            답글달기
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // commentPlus
  // ------------------------------------------
  if (type === "commentPlus") {
    return (
      <div
        className={clsx(
          styles.commentPlus,
          styles.commentPlusMd,
          className
        )}
      >
        <div className={styles.commentContainer}>
          <div className={styles.commentPlusHeader}>
            <div className={styles.commentPlusHeaderLeft}>
              <Icon name="reply" size={12} color="gray-subtle" />
              <Avatar size="xs" image={profileImage} />
              <UserInfo
                type="comment"
                nickname={nickname}
                showTag={isAuthor}
                showTime={!!timeCount}
                timeCount={timeCount}
              />
            </div>
            <IconButton
              variant="sm"
              icon={<Icon name="dotmenu" size={16} />}
              onClick={onMenuClick}
              aria-label="메뉴"
            />
          </div>
          <p className={styles.commentPlusContent}>
            {mentionName && (
              <span className={styles.commentPlusMention}>
                @{mentionName}{" "}
              </span>
            )}
            {commentText}
          </p>
        </div>
        <div className={styles.commentPlusActions}>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onLikeClick}
          >
            <Icon name="heart" size={16} color="gray-subtle" />
            {likeCount}
          </button>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onReplyClick}
          >
            <Icon name="chat-round" size={16} color="gray-subtle" />
            답글달기
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // commentPlusxs
  // ------------------------------------------
  if (type === "commentPlusxs") {
    return (
      <div
        className={clsx(
          styles.commentPlus,
          styles.commentPlusXs,
          className
        )}
      >
        <div className={styles.commentContainer}>
          <div className={styles.commentPlusHeader}>
            <div className={styles.commentPlusHeaderLeft}>
              <Icon name="reply" size={12} color="gray-subtle" />
              <Avatar size="xs" image={profileImage} />
              <UserInfo
                type="comment"
                nickname={nickname}
                showTag={isAuthor}
                showTime={!!timeCount}
                timeCount={timeCount}
              />
            </div>
            <IconButton
              variant="sm"
              icon={<Icon name="dotmenu" size={16} />}
              onClick={onMenuClick}
              aria-label="메뉴"
            />
          </div>
          <p className={styles.commentPlusContent}>
            {mentionName && (
              <span className={styles.commentPlusMention}>
                @{mentionName}{" "}
              </span>
            )}
            {commentText}
          </p>
        </div>
        <div className={styles.commentPlusActions}>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onLikeClick}
          >
            <Icon name="heart" size={16} color="gray-subtle" />
            {likeCount}
          </button>
          <button
            type="button"
            className={styles.commentActionBtn}
            onClick={onReplyClick}
          >
            <Icon name="chat-round" size={16} color="gray-subtle" />
            답글달기
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // commentDeleted
  // ------------------------------------------
  if (type === "commentDeleted") {
    return (
      <div className={clsx(styles.commentDeleted, className)}>
        <span className={styles.commentDeletedText}>
          삭제된 댓글입니다.
        </span>
      </div>
    );
  }

  return null;
}
