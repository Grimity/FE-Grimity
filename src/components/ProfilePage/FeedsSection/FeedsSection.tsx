import { useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { useDragScroll } from "@/hooks/useDragScroll";
import { useDeviceStore } from "@/states/deviceStore";

import Icon from "@/components/common/Icon/Icon";
import Category from "@/components/common/SegmentedControl/Category/Category";
import Album from "@/components/common/Card/Album/Album";
import Empty from "@/components/common/Empty/Empty";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Filter from "@/components/common/Filter/Filter";

import ResponsiveMenu from "../shared/ResponsiveMenu/ResponsiveMenu";
import { sortOptions, type SortOption } from "./constants";
import { useProfileFeeds } from "./hooks/useProfileFeeds";
import { useFeedLikeToggle } from "./hooks/useFeedLikeToggle";
import type { FeedsSectionProps } from "./FeedsSection.types";

import styles from "../ProfilePage.module.scss";

// 그림 정리 모드에서만 필요한 컴포넌트라 초기 번들에서 분리한다
const FeedAlbumEditor = dynamic(() => import("../FeedAlbumEditor/FeedAlbumEditor"));

export default function FeedsSection({
  userId,
  isMyProfile,
  authorName,
  feedCount,
  albums,
  isEditMode,
  onToggleEditMode,
  onEditAlbums,
}: FeedsSectionProps) {
  const router = useRouter();
  const { isMobile } = useDeviceStore();
  const categoryBarRef = useRef<HTMLDivElement>(null);

  useDragScroll(categoryBarRef as React.RefObject<HTMLElement>, { scrollSpeed: 2 });

  const {
    feeds,
    feedsQueryKey,
    sortBy,
    activeAlbum,
    hasNextPage,
    loadMoreRef,
    changeSort,
    changeAlbum,
    refetch,
  } = useProfileFeeds(userId);

  const toggleLike = useFeedLikeToggle(feedsQueryKey);

  // 정리 모드를 드나들 때마다 앨범 이동 결과를 목록에 반영한다
  const handleToggleEditMode = () => {
    onToggleEditMode();
    refetch();
  };

  if (isEditMode) {
    return (
      <FeedAlbumEditor
        feeds={feeds}
        albums={albums}
        activeAlbum={activeAlbum}
        onExitEditMode={handleToggleEditMode}
      />
    );
  }

  const isEmpty = feeds.length === 0;

  return (
    <div className={styles.profileContent}>
      <section className={styles.header}>
        <div className={styles.categoryContainer}>
          <div className={styles.categoryBar} ref={categoryBarRef}>
            <Category
              active={activeAlbum === null}
              title="전체"
              showNumber={false}
              onClick={() => changeAlbum(null)}
            />
            {albums.map((album) => (
              <Category
                key={album.id}
                active={activeAlbum === album.id}
                title={album.name}
                showNumber
                number={album.feedCount}
                onClick={() => changeAlbum(album.id)}
              />
            ))}
          </div>
          {isMyProfile && (
            <IconButton
              variant="outlined"
              icon={<Icon name="folder-edit" size={16} />}
              onClick={onEditAlbums}
              aria-label="앨범 편집"
              className={styles.addCategoryBtn}
            />
          )}
        </div>
      </section>

      <div className={styles.postsContainer}>
        <div className={styles.resultsBar}>
          <div className={styles.resultsLabel}>
            <span>게시물</span>
            <span>
              <span className={styles.resultsCount}>{feedCount}</span>건
            </span>
          </div>
          <div className={styles.rightBar}>
            {isMyProfile && (
              <TextButton
                variant="assistive"
                size="regular"
                iconRight={<Icon name="sort-horizontal" size={16} />}
                onClick={handleToggleEditMode}
                disabled={isEmpty}
              >
                그림 정리
              </TextButton>
            )}
            {/* 모바일은 정렬 옵션을 바텀시트로 띄워야 해서 ResponsiveMenu를 쓴다 */}
            {isMobile ? (
              <ResponsiveMenu
                mobileTitle="정렬"
                disabled={isEmpty}
                trigger={
                  <button type="button" className={styles.sortTrigger} disabled={isEmpty}>
                    <span>
                      {sortOptions.find((option) => option.value === sortBy)?.label ?? "최신순"}
                    </span>
                    <Icon name="chevron-down" size={16} />
                  </button>
                }
                items={sortOptions.map((option) => ({
                  label: option.label,
                  selected: sortBy === option.value,
                  onClick: () => changeSort(option.value),
                }))}
              />
            ) : (
              <Filter
                variant="text"
                options={sortOptions}
                value={sortBy}
                onChange={(value) => changeSort(value as SortOption)}
                disabled={isEmpty}
              />
            )}
          </div>
        </div>

        {isEmpty ? (
          <div className={styles.emptyWrap}>
            <Empty
              size="xl"
              iconName={isMyProfile ? "illust-upload-success" : "illust-result-null"}
              title={isMyProfile ? "첫 그림을 업로드해보세요" : "업로드한 그림이 없어요"}
              buttonLabel={isMyProfile ? "그림 업로드" : undefined}
              onButtonClick={isMyProfile ? () => router.push("/write") : undefined}
            />
          </div>
        ) : (
          <section className={styles.cardContainer}>
            {feeds.map((feed, index) => (
              <Album
                key={`${feed.id}-${index}`}
                variant="mainTitle"
                imageUrl={feed.thumbnail}
                title={feed.title}
                nickname={authorName}
                likeCount={feed.likeCount}
                viewCount={feed.viewCount}
                feedHref={`/feeds/${feed.id}`}
                isLiked={feed.isLike}
                onLikeClick={() => toggleLike(feed.id, feed.isLike)}
              />
            ))}
            {hasNextPage && <div ref={loadMoreRef} />}
          </section>
        )}
      </div>
    </div>
  );
}
