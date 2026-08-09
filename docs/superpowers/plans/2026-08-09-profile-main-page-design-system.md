# 프로필 메인 화면 디자인 시스템 마이그레이션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `src/components/ProfilePage/` 트리를 `src/components/common` 디자인 시스템 컴포넌트로 교체하고, 데스크탑(≥1200px)/태블릿(768~1199px)/모바일(<768px) 3개 브레이크포인트에 반응형 대응한다.

**Architecture:** 기존 폴더 구조를 유지한 채 각 하위 컴포넌트(ProfileCover/ProfileImage/ProfileDetails/ProfileActions)와 `ProfilePage.tsx`의 내부 마크업만 신규 컴포넌트로 교체한다. 레이아웃/여백/그리드 열 수는 SCSS 브레이크포인트 믹스인으로 처리하고, 컴포넌트가 아예 바뀌는 지점(더보기 메뉴 Menu↔BottomSheet)만 `useDeviceStore().isMobile`로 분기하는 신규 공용 컴포넌트 `ResponsiveMenu`를 하나 추가한다.

**Tech Stack:** Next.js 15 Pages Router, TypeScript, SCSS Modules(`@/styles/tokens/*`, `@/styles/breakpoint`), Zustand, React Query(기존 훅 재사용).

**참조 스펙:** `docs/superpowers/specs/2026-08-09-profile-main-page-design-system.md`

## Global Constraints

- 이 저장소에는 자동화 테스트 프레임워크가 없다(jest/vitest 미설정, 기존 테스트 파일 없음). 따라서 아래 각 태스크의 "테스트 사이클"은 스펙의 검증 계획을 그대로 따라 **`npm run lint` → `npx tsc --noEmit` → 명시된 수동 확인** 순서로 대체한다. 이 저장소에 없는 테스트 프레임워크를 새로 도입하지 않는다.
- 새 API 엔드포인트, 새 기능, 새 동작을 추가하지 않는다 — 기존 훅(`useUserDataByUrl`, `useUserFeeds`, `useUserPosts`, `useFollow`, `useCoverImage`, `useProfileImage`, `useUserBlock`, `useShareModal`, `useReportModal`, `useModal`, `useDragScroll`)을 그대로 재사용한다.
- 터치하는 모든 `.module.scss` 파일은 `@/styles/tokens/colors/semantic`, `@/styles/tokens/typography/semantic`, `@/styles/tokens/spacing`, `@/styles/tokens/radius`, `@/styles/breakpoint`만 `@use`한다. 레거시 `@/styles/globals.scss`의 `Size()`/`Body1`/`Sub2`/`$gray*` 믹스인은 터치하는 파일에서 전부 제거한다.
- 아이콘은 전부 `common/Icon`의 `IconName`에서 가져온다(신규 에셋 추가 없음 — 확인 완료).
- 한글 문구는 스펙 문서에 명시된 문자열을 그대로 사용한다.
- 그림 정리 모드(`FeedAlbumEditor`)와 앨범 편집 화면 **내부**는 건드리지 않는다 — 진입 버튼/아이콘만 새 디자인.
- `Board/BoardAll/AllCard`는 건드리지 않는다.
- 피드 그리드 카드의 좋아요 버튼: `UserFeedsResponse.feeds`(백엔드 DTO)에 `isLike` 필드가 없다 — 좋아요 토글 API가 없으므로 `Card/Album`의 `isLiked`/`onLikeClick`은 전달하지 않는다(하트 아이콘 자체가 렌더되지 않음, `Album` 컴포넌트는 `onLikeClick`이 없으면 좋아요 버튼을 그리지 않도록 이미 구현되어 있음). 이는 기존 동작(레거시 `ProfileCard`도 좋아요 토글 없음)과 동일하다.

---

## Task 1: `ResponsiveMenu` 공용 컴포넌트 (Menu ↔ BottomSheet)

더보기(⋯) 메뉴와 정렬 메뉴 두 곳에서 동일하게 필요한 "데스크탑/태블릿은 팝오버 메뉴, 모바일은 바텀시트" 패턴을 캡슐화한다. `src/components/common`에 넣지 않고 `ProfilePage` 전용 공유 폴더에 둔다(디자인 리뷰 없이 전역 디자인 시스템에 컴포넌트를 추가하지 않기 위함).

**Files:**
- Create: `src/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu.tsx`
- Create: `src/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu.types.ts`
- Create: `src/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu.module.scss`

**Interfaces:**
- Consumes: `common/Navigation/Menu/Menu`(`{items, trigger, align}`), `common/PopUp/BottomSheet/BottomSheet`(`{isOpen, onClose, title, showCloseIcon, children}`), `common/Cell/ListItem/ListItem`(`{type="textLg", text, active, onClick}`), `useDeviceStore().isMobile`
- Produces: `ResponsiveMenu` 컴포넌트, `ResponsiveMenuItem = { label: string; onClick: () => void; selected?: boolean }`. Task 5(ProfileActions)와 Task 8(정렬 컨트롤)에서 `trigger`/`items`/`mobileTitle` props로 사용한다.

- [ ] **Step 1: 타입 정의**

`src/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu.types.ts`:
```ts
import type { ReactNode } from "react";

export interface ResponsiveMenuItem {
  label: string;
  onClick: () => void;
  selected?: boolean;
}

export interface ResponsiveMenuProps {
  trigger: ReactNode;
  items: ResponsiveMenuItem[];
  mobileTitle?: string;
  align?: "left" | "right";
}
```

- [ ] **Step 2: 컴포넌트 구현**

`src/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu.tsx`:
```tsx
import { useState } from "react";
import clsx from "clsx";

import Menu from "@/components/common/Navigation/Menu/Menu";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import { useDeviceStore } from "@/states/deviceStore";

import styles from "./ResponsiveMenu.module.scss";
import type { ResponsiveMenuProps } from "./ResponsiveMenu.types";

export default function ResponsiveMenu({
  trigger,
  items,
  mobileTitle,
  align = "right",
}: ResponsiveMenuProps) {
  const { isMobile } = useDeviceStore();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className={styles.triggerWrap} onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={mobileTitle}
          showCloseIcon
        >
          <div className={styles.list}>
            {items.map((item) => (
              <ListItem
                key={item.label}
                type="textLg"
                text={item.label}
                active={item.selected}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </BottomSheet>
      </>
    );
  }

  return (
    <Menu
      trigger={trigger}
      items={items.map(({ label, onClick, selected }) => ({ label, onClick, selected }))}
      align={align}
      className={clsx(styles.desktopMenu)}
    />
  );
}
```

- [ ] **Step 3: 스타일**

`src/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu.module.scss`:
```scss
.triggerWrap {
  display: inline-flex;
  cursor: pointer;
}

.list {
  display: flex;
  flex-direction: column;
}

.desktopMenu {
  min-width: 160px;
}
```

- [ ] **Step 4: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: 에러 없음(이 시점에는 아직 아무 곳에서도 import하지 않으므로 미사용 경고만 없으면 통과).

- [ ] **Step 5: 커밋**

```bash
git add src/components/ProfilePage/shared/ResponsiveMenu
git commit -m "Feat: 프로필 더보기/정렬 공용 ResponsiveMenu 컴포넌트 추가"
```

---

## Task 2: `ProfileCover` 마이그레이션

**Files:**
- Modify: `src/components/ProfilePage/Profile/ProfileCover/ProfileCover.tsx` (전체 교체)
- Modify: `src/components/ProfilePage/Profile/ProfileCover/ProfileCover.module.scss` (전체 교체)
- Modify: `src/components/ProfilePage/Profile/Profile.tsx:214-220` (`ProfileCover`에 넘기는 props 변경)

**Interfaces:**
- Consumes: `common/Thumbnail/Thumbnail`(`{src, alt, ratio}`), `common/Button/IconButton/IconButton`(`{variant, icon, onClick, aria-label, className}`), `common/Button/SolidButton/SolidButton`(`{size, iconLeft, onClick, children}`), `common/Icon/Icon`
- Produces: `ProfileCoverProps = { userData: UserData; coverImage: string; isMyProfile: boolean; handleAddCover: (e) => Promise<void>; handleDeleteImage: () => void }` — `userId` prop 제거, `isMyProfile` prop 추가(Task 6에서 `Profile.tsx`가 넘겨줌).

- [ ] **Step 1: `ProfileCover.tsx` 교체**

```tsx
import { useRef } from "react";

import Thumbnail from "@/components/common/Thumbnail/Thumbnail";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import Icon from "@/components/common/Icon/Icon";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import styles from "@/components/ProfilePage/Profile/ProfileCover/ProfileCover.module.scss";

interface ProfileCoverProps {
  userData: UserData;
  coverImage: string;
  isMyProfile: boolean;
  handleAddCover: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteImage: () => void;
}

export default function ProfileCover({
  userData,
  coverImage,
  isMyProfile,
  handleAddCover,
  handleDeleteImage,
}: ProfileCoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadCover = () => {
    inputRef.current?.click();
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
  };

  if (!userData) return null;

  return (
    <div className={styles.cover}>
      {userData.backgroundImage ? (
        <>
          <Thumbnail
            src={coverImage}
            alt="커버 이미지"
            ratio="4/1"
            className={styles.thumbnail}
          />
          {isMyProfile && (
            <div className={styles.editButtons}>
              <IconButton
                variant="solid"
                icon={<Icon name="camera" size={16} color="white" />}
                onClick={handleUploadCover}
                aria-label="커버 이미지 변경"
                className={styles.overlayBtn}
              />
              <IconButton
                variant="solid"
                icon={<Icon name="x" size={16} color="white" />}
                onClick={handleDeleteImage}
                aria-label="커버 이미지 삭제"
                className={styles.overlayBtn}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyCover}>
          {isMyProfile && (
            <SolidButton
              size="regular"
              iconLeft={<Icon name="plus" size={16} />}
              onClick={handleUploadCover}
            >
              커버 추가하기
            </SolidButton>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleAddCover}
        onClick={handleInputClick}
      />
    </div>
  );
}
```

- [ ] **Step 2: `ProfileCover.module.scss` 교체**

```scss
@use "@/styles/tokens/colors/semantic" as colors;
@use "@/styles/tokens/spacing" as spacing;

.cover {
  position: relative;
  width: 100%;
}

.thumbnail {
  border-radius: 0;
}

.emptyCover {
  width: 100%;
  aspect-ratio: 4 / 1;
  background-color: colors.$surface-gray-subtlest;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editButtons {
  position: absolute;
  top: spacing.$spacing-16;
  right: spacing.$spacing-16;
  display: flex;
  gap: spacing.$spacing-8;
  z-index: 2;
}

.overlayBtn {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);

  &:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.55);
  }
}
```

- [ ] **Step 3: `Profile.tsx` 호출부 수정**

Modify `src/components/ProfilePage/Profile/Profile.tsx:214-220`, 기존:
```tsx
          <ProfileCover
            userData={userData}
            coverImage={coverImage}
            userId={user_id}
            handleAddCover={handleAddCover}
            handleDeleteImage={handleDeleteImage}
          />
```
교체:
```tsx
          <ProfileCover
            userData={userData}
            coverImage={coverImage}
            isMyProfile={isMyProfile}
            handleAddCover={handleAddCover}
            handleDeleteImage={handleDeleteImage}
          />
```

> 이 시점에는 `user_id` 셀렉터가 아직 다른 곳에서 쓰이지 않아 미사용 변수 경고가 뜬다 — Task 6에서 함께 정리한다(지금은 무시하고 진행).

- [ ] **Step 4: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: `ProfileCover` 관련 타입 에러 없음. `user_id` 미사용 경고는 Task 6까지는 남아있는 게 정상.

- [ ] **Step 5: 커밋**

```bash
git add src/components/ProfilePage/Profile/ProfileCover src/components/ProfilePage/Profile/Profile.tsx
git commit -m "Feat: ProfileCover 디자인 시스템 컴포넌트로 마이그레이션"
```

---

## Task 3: `ProfileImage` 마이그레이션

**Files:**
- Modify: `src/components/ProfilePage/Profile/ProfileImage/ProfileImage.tsx` (전체 교체)
- Modify: `src/components/ProfilePage/Profile/ProfileImage/ProfileImage.module.scss` (전체 교체)
- Modify: `src/components/ProfilePage/Profile/Profile.tsx:224-230` (`ProfileImage`에 넘기는 props 변경)

**Interfaces:**
- Consumes: `common/Avatar/Avatar`(`{src, size, alt}`), `common/Button/IconButton/IconButton`
- Produces: `ProfileImageProps = { profileImage: string; isMyProfile: boolean; handleFileChange; handleDeleteProfileImage }` — `isMobile` prop 제거(아바타는 모든 브레이크포인트에서 80px 고정), `handleDeleteProfileImage`는 prop으로 계속 받지만 이번 화면에는 별도 삭제 버튼이 없다(Figma 메인 화면에는 연필 편집 뱃지 1개만 존재 — 삭제는 Phase 2 "프로필 이미지 수정" 모달에서 처리).

- [ ] **Step 1: `ProfileImage.tsx` 교체**

```tsx
import { useRef } from "react";

import Avatar from "@/components/common/Avatar/Avatar";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Icon from "@/components/common/Icon/Icon";

import styles from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage.module.scss";

const AVATAR_SIZE = 80;
const DEFAULT_IMAGE = "/image/default.svg";

interface ProfileImageProps {
  profileImage: string;
  isMyProfile: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileImage({
  profileImage,
  isMyProfile,
  handleFileChange,
}: ProfileImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.profileImageContainer}>
      <Avatar
        src={profileImage === DEFAULT_IMAGE ? undefined : profileImage}
        size={AVATAR_SIZE}
        alt="프로필 이미지"
      />
      {isMyProfile && (
        <>
          <IconButton
            variant="solid"
            icon={<Icon name="pen-1" size={16} color="white" />}
            onClick={handleUploadImage}
            aria-label="프로필 이미지 변경"
            className={styles.editBtn}
          />
          <input
            ref={inputRef}
            id="upload-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: `ProfileImage.module.scss` 교체**

```scss
.profileImageContainer {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.editBtn {
  position: absolute;
  bottom: -2px;
  right: -2px;
  border: 2px solid white;
}
```

- [ ] **Step 3: `Profile.tsx` 호출부 수정**

Modify `src/components/ProfilePage/Profile/Profile.tsx:224-230`, 기존:
```tsx
                <ProfileImage
                  profileImage={profileImage}
                  isMobile={isMobile}
                  isMyProfile={isMyProfile}
                  handleFileChange={handleFileChange}
                  handleDeleteProfileImage={handleDeleteProfileImage}
                />
```
교체:
```tsx
                <ProfileImage
                  profileImage={profileImage}
                  isMyProfile={isMyProfile}
                  handleFileChange={handleFileChange}
                />
```

> `handleDeleteProfileImage`(from `useProfileImage`)는 이제 이 파일에서 미사용이 된다 — Task 6에서 `Profile.tsx`를 정리할 때 함께 제거한다.

- [ ] **Step 4: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: `ProfileImage` 관련 타입 에러 없음.

- [ ] **Step 5: 커밋**

```bash
git add src/components/ProfilePage/Profile/ProfileImage src/components/ProfilePage/Profile/Profile.tsx
git commit -m "Feat: ProfileImage 디자인 시스템 컴포넌트로 마이그레이션"
```

---

## Task 4: `common/Cell/UserInfo`에 팔로워/팔로잉 클릭 핸들러 추가 + `ProfileDetails` 마이그레이션

`Cell/UserInfo`의 `type="follow"`는 현재 순수 표시용이라 클릭 핸들러가 없다. 프로필 화면은 팔로워/팔로잉 카운트를 각각 클릭해 별도 모달(`FOLLOWER`/`FOLLOWING`)을 여는 기존 동작이 있으므로, 하위 호환을 유지하며 옵션 prop 2개를 추가한다(기존 사용처인 `Cell/UserItem`의 `follow` 타입은 이 prop을 넘기지 않으므로 영향 없음).

**Files:**
- Modify: `src/components/common/Cell/UserInfo/UserInfo.types.ts`
- Modify: `src/components/common/Cell/UserInfo/UserInfo.tsx`
- Modify: `src/components/common/Cell/UserInfo/UserInfo.module.scss`
- Modify: `src/components/ProfilePage/Profile/ProfileDetails/ProfileDetails.tsx` (전체 교체)
- Modify: `src/components/ProfilePage/Profile/ProfileDetails/ProfileDetails.module.scss` (전체 교체)

**Interfaces:**
- Consumes: `common/Cell/UserInfo`(수정 후), `common/Cell/UserItem`(`type="link"`), `common/Icon/Icon`
- Produces: `ProfileDetailsProps`는 기존과 동일한 시그니처 유지(`userData, isMyProfile, isMobile, children, handleOpenFollowerModal, handleOpenFollowingModal`) — `Profile.tsx` 쪽 호출부는 변경 없음.

- [ ] **Step 1: `UserInfo.types.ts`에 클릭 핸들러 prop 추가**

Modify `src/components/common/Cell/UserInfo/UserInfo.types.ts`, `/** follow only */` 블록을 아래로 교체:
```ts
  /** follow only */
  followerCount?: string;
  showFollowing?: boolean;
  followingCount?: string;
  onFollowerClick?: () => void;
  onFollowingClick?: () => void;
```

- [ ] **Step 2: `UserInfo.tsx`의 `follow` 분기 수정**

Modify `src/components/common/Cell/UserInfo/UserInfo.tsx`, 함수 시그니처의 구조분해에 `onFollowerClick`, `onFollowingClick` 추가:
```tsx
export default function UserInfo({
  type = "default",
  nickname,
  showHeart = false,
  heartCount,
  showView = false,
  viewCount,
  showTime = false,
  timeCount,
  showChatting = false,
  chattingCount,
  showTag = false,
  followerCount,
  showFollowing = false,
  followingCount,
  onFollowerClick,
  onFollowingClick,
  className,
}: UserInfoProps) {
```

같은 파일의 `if (type === "follow") { ... }` 블록 전체를 아래로 교체:
```tsx
  if (type === "follow") {
    return (
      <div className={clsx(styles.userInfo, styles.follow, className)}>
        {onFollowerClick ? (
          <button type="button" className={styles.followPair} onClick={onFollowerClick}>
            <span className={styles.followLabel}>팔로워</span>
            <span className={styles.followCount}>{followerCount}</span>
          </button>
        ) : (
          <span className={styles.followPair}>
            <span className={styles.followLabel}>팔로워</span>
            <span className={styles.followCount}>{followerCount}</span>
          </span>
        )}
        {showFollowing &&
          (onFollowingClick ? (
            <button type="button" className={styles.followPair} onClick={onFollowingClick}>
              <span className={styles.followLabel}>팔로잉</span>
              <span className={styles.followCount}>{followingCount}</span>
            </button>
          ) : (
            <span className={styles.followPair}>
              <span className={styles.followLabel}>팔로잉</span>
              <span className={styles.followCount}>{followingCount}</span>
            </span>
          ))}
      </div>
    );
  }
```

- [ ] **Step 3: `UserInfo.module.scss`에 버튼 리셋 추가**

Modify `src/components/common/Cell/UserInfo/UserInfo.module.scss`, `.followPair` 규칙을 아래로 교체(기존 `display/align-items/gap`에 버튼 리셋 추가):
```scss
.followPair {
  display: inline-flex;
  align-items: center;
  gap: spacing.$spacing-2;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  cursor: default;

  button& {
    cursor: pointer;
  }
}
```

- [ ] **Step 4: `ProfileDetails.tsx` 교체**

```tsx
import { useModalStore } from "@/states/modalStore";
import UserInfo from "@/components/common/Cell/UserInfo/UserInfo";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Icon from "@/components/common/Icon/Icon";
import type { IconName } from "@/components/common/Icon/Icon.types";

import type { UserProfileResponse as UserData } from "@grimity/dto";

import { formatCurrency } from "@/utils/formatCurrency";
import { useClipboard } from "@/utils/copyToClipboard";

import styles from "./ProfileDetails.module.scss";

const ICON_MAP_KO: Record<string, IconName> = {
  인스타그램: "instagram",
  유튜브: "youtube",
  픽시브: "pixiv",
  X: "xtwitter",
  이메일: "email",
  "직접 입력": "link",
};

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
const MAX_VISIBLE_LINKS = 3;

interface ProfileDetailsProps extends React.PropsWithChildren {
  userData: UserData;
  isMyProfile: boolean;
  isMobile: boolean;
  handleOpenFollowerModal: () => void;
  handleOpenFollowingModal: () => void;
}

export default function ProfileDetails({
  userData,
  isMyProfile,
  isMobile,
  children,
  handleOpenFollowerModal,
  handleOpenFollowingModal,
}: ProfileDetailsProps) {
  const { copyToClipboard } = useClipboard();
  const openModal = useModalStore((state) => state.openModal);

  const displayName = (linkName: string, link: string) => {
    if (EMAIL_PATTERN.test(link)) return link;
    if (linkName === "X") {
      const handleMatch = link.match(/^https?:\/\/(?:www\.)?x\.com\/([a-zA-Z0-9_]+)/i);
      return handleMatch ? `@${handleMatch[1]}` : linkName;
    }
    return linkName;
  };

  const handleLinkClick = (link: string) => {
    if (EMAIL_PATTERN.test(link)) {
      copyToClipboard(link, "이메일 주소가 복사되었습니다.");
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.nameContainer}>
          <h2 className={styles.name}>{userData.name}</h2>
          <UserInfo
            type="follow"
            followerCount={formatCurrency(userData.followerCount)}
            showFollowing={isMyProfile}
            followingCount={isMyProfile ? formatCurrency(userData.followingCount) : undefined}
            onFollowerClick={isMyProfile ? handleOpenFollowerModal : undefined}
            onFollowingClick={isMyProfile ? handleOpenFollowingModal : undefined}
          />
        </div>
        <div className={styles.actionsSlot}>{children}</div>
      </div>

      {userData.description && <p className={styles.description}>{userData.description}</p>}

      <div className={styles.linkContainer}>
        {userData.links.slice(0, MAX_VISIBLE_LINKS).map(({ linkName, link }, index) => (
          <div key={index} className={styles.linkWrapper}>
            <UserItem
              type="link"
              brandIcon={<Icon name={ICON_MAP_KO[linkName] || "link"} size={20} />}
              siteName={displayName(linkName, link)}
              onClick={() => handleLinkClick(link)}
            />
            {index === MAX_VISIBLE_LINKS - 1 && userData.links.length > MAX_VISIBLE_LINKS && (
              <span
                className={styles.moreLinksText}
                onClick={() =>
                  openModal({
                    type: "PROFILE-LINK",
                    data: null,
                    isFill: isMobile,
                  })
                }
              >
                외 링크 {userData.links.length - MAX_VISIBLE_LINKS}개
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `ProfileDetails.module.scss` 교체**

```scss
@use "@/styles/tokens/colors/semantic" as colors;
@use "@/styles/tokens/typography/semantic" as typo;
@use "@/styles/tokens/spacing" as spacing;
@use "@/styles/breakpoint" as bp;

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: spacing.$spacing-8;
}

.headerRow {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: spacing.$spacing-16;
}

.nameContainer {
  display: flex;
  flex-direction: column;
  gap: spacing.$spacing-8;
  min-width: 0;
}

.name {
  @include typo.title-1;
  color: colors.$text-gray-bold;

  @include bp.breakpoint-down("xs") {
    @include typo.title-3;
  }
}

.actionsSlot {
  flex-shrink: 0;
}

.description {
  @include typo.label-6;
  color: colors.$text-gray-subtler;
  white-space: pre-line;
}

.linkContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: spacing.$spacing-12;

  @include bp.breakpoint-down("xs") {
    flex-direction: column;
    align-items: flex-start;
    gap: spacing.$spacing-6;
  }
}

.linkWrapper {
  display: flex;
  align-items: center;
  gap: spacing.$spacing-4;
}

.moreLinksText {
  @include typo.label-6;
  color: colors.$text-primary-normal;
  cursor: pointer;
}
```

- [ ] **Step 6: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: 에러 없음. `common/Cell/UserInfo`를 사용하는 다른 화면(`Cell/UserItem` type=`follow`)이 있는지 `grep -rn "UserInfo" src/components/common/Cell/UserItem/UserItem.tsx`로 확인 — `onFollowerClick`/`onFollowingClick`을 넘기지 않으므로 그대로 `<span>`으로 렌더되어 회귀 없음을 코드로 확인한다.

- [ ] **Step 7: 커밋**

```bash
git add src/components/common/Cell/UserInfo src/components/ProfilePage/Profile/ProfileDetails
git commit -m "Feat: UserInfo 팔로우 클릭 핸들러 추가 및 ProfileDetails 마이그레이션"
```

---

## Task 5: `ProfileActions` 마이그레이션 (버튼 + 더보기 메뉴 상태 매트릭스)

스펙의 상태 매트릭스(내 프로필 / 타 프로필 / 차단당함 / 차단함)를 그대로 구현한다. 내 프로필의 더보기 메뉴는 "내 계정 설정"(`/settings/account`)과 "차단 목록"만 남기고 기존의 "프로필 공유"/"회원 탈퇴" 항목은 제거한다(회원탈퇴는 이미 설정 페이지로 이동됨).

**Files:**
- Modify: `src/components/ProfilePage/Profile/ProfileActions/ProfileActions.tsx` (전체 교체)
- Modify: `src/components/ProfilePage/Profile/ProfileActions/ProfileActions.module.scss` (전체 교체)
- Modify: `src/components/ProfilePage/Profile/Profile.tsx` (props 전달부 수정 — Task 6에서 함께 처리)

**Interfaces:**
- Consumes: `common/Button/OutlinedButton`, `common/Button/SolidButton`, `common/Icon/Icon`, `ResponsiveMenu`(Task 1)
- Produces: `ProfileActionsProps = { isMyProfile, isFollowing, isBlocked, isBlocking, handleOpenEditModal, handleOpenAccountSettings, handleUnfollowClick, handleFollowClick, handleShareProfile, handleOpenReportModal, handleBlockClick, handleUnblockClick, handleOpenBlocklistModal, handleSendMessage }` — `handleWithdrawal` prop 제거, `handleOpenAccountSettings` prop 신규 추가.

- [ ] **Step 1: `ProfileActions.tsx` 교체**

```tsx
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import Icon from "@/components/common/Icon/Icon";
import ResponsiveMenu from "@/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu";

import styles from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions.module.scss";

interface ProfileActionsProps {
  isMyProfile: boolean;
  isFollowing: boolean;
  isBlocked: boolean;
  isBlocking: boolean;
  handleOpenEditModal: () => void;
  handleOpenAccountSettings: () => void;
  handleUnfollowClick: () => void;
  handleFollowClick: () => void;
  handleShareProfile: () => void;
  handleOpenReportModal: () => void;
  handleBlockClick: () => void;
  handleUnblockClick: () => void;
  handleOpenBlocklistModal: () => void;
  handleSendMessage: () => void;
}

export default function ProfileActions({
  isMyProfile,
  isFollowing,
  isBlocked,
  isBlocking,
  handleOpenEditModal,
  handleOpenAccountSettings,
  handleUnfollowClick,
  handleFollowClick,
  handleShareProfile,
  handleOpenReportModal,
  handleBlockClick,
  handleUnblockClick,
  handleOpenBlocklistModal,
  handleSendMessage,
}: ProfileActionsProps) {
  const moreTrigger = (
    <OutlinedButton size="regular" iconOnly={<Icon name="dotmenu" size={20} />} aria-label="더보기" />
  );

  const shareMenuItem = { label: "프로필 링크 공유", onClick: handleShareProfile };
  const messageMenuItem = { label: "메시지 보내기", onClick: handleSendMessage };
  const reportMenuItem = { label: "신고하기", onClick: handleOpenReportModal };
  const blockMenuItem = {
    label: isBlocking ? "차단해제" : "차단하기",
    onClick: isBlocking ? handleUnblockClick : handleBlockClick,
  };

  if (isMyProfile) {
    return (
      <div className={styles.actions}>
        <OutlinedButton size="regular" onClick={handleOpenEditModal}>
          프로필 편집
        </OutlinedButton>
        <ResponsiveMenu
          trigger={moreTrigger}
          mobileTitle="더보기"
          items={[
            { label: "내 계정 설정", onClick: handleOpenAccountSettings },
            { label: "차단 목록", onClick: handleOpenBlocklistModal },
          ]}
        />
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className={styles.actions}>
        <ResponsiveMenu
          trigger={moreTrigger}
          mobileTitle="더보기"
          items={[shareMenuItem, reportMenuItem]}
        />
      </div>
    );
  }

  if (isBlocking) {
    return (
      <div className={styles.actions}>
        <ResponsiveMenu
          trigger={moreTrigger}
          mobileTitle="더보기"
          items={[shareMenuItem, blockMenuItem, reportMenuItem]}
        />
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      {isFollowing ? (
        <OutlinedButton size="regular" onClick={handleUnfollowClick}>
          팔로잉 중
        </OutlinedButton>
      ) : (
        <SolidButton size="regular" onClick={handleFollowClick}>
          팔로우
        </SolidButton>
      )}
      <ResponsiveMenu
        trigger={moreTrigger}
        mobileTitle="더보기"
        items={[shareMenuItem, messageMenuItem, blockMenuItem, reportMenuItem]}
      />
    </div>
  );
}
```

- [ ] **Step 2: `ProfileActions.module.scss` 교체**

```scss
@use "@/styles/tokens/spacing" as spacing;

.actions {
  display: flex;
  align-items: center;
  gap: spacing.$spacing-8;
  flex-shrink: 0;
}
```

- [ ] **Step 3: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: `ProfileActions.tsx` 자체는 타입 에러 없음. `Profile.tsx`가 아직 옛 props(`handleWithdrawal` 등)를 넘기고 있어 `Profile.tsx`에서 타입 에러가 날 수 있다 — Task 6에서 해결되므로 지금은 `ProfileActions.tsx` 파일 자체에 에러가 없는지만 확인한다(`npx tsc --noEmit`은 프로젝트 전체를 체크하므로 이 시점엔 실패가 정상 — Task 6까지 완료 후 재확인).

- [ ] **Step 4: 커밋**

```bash
git add src/components/ProfilePage/Profile/ProfileActions
git commit -m "Feat: ProfileActions 상태별 버튼/더보기 메뉴 마이그레이션"
```

---

## Task 6: `Profile.tsx` 배선 정리 + `Profile.module.scss` 레이아웃 + 로컬 `Category` 컴포넌트 제거

Task 2/3/5에서 변경한 하위 컴포넌트들의 props에 맞춰 `Profile.tsx`를 정리하고, 더 이상 쓰이지 않는 `handleWithdrawal`/`user_id`/`handleDeleteProfileImage` 배선을 제거한다. 또한 `ProfilePage/Profile/CategoryBar/Category`는 `common/SegmentedControl/Category`와 이름만 같은 별개의 레거시 로컬 컴포넌트이므로 삭제한다(Task 7에서 `ProfilePage.tsx`가 `common/SegmentedControl/Category`를 직접 사용하도록 교체).

**Files:**
- Modify: `src/components/ProfilePage/Profile/Profile.tsx`
- Modify: `src/components/ProfilePage/Profile/Profile.module.scss` (전체 교체)
- Delete: `src/components/ProfilePage/Profile/CategoryBar/Category/Category.tsx`
- Delete: `src/components/ProfilePage/Profile/CategoryBar/Category/Category.types.ts`
- Delete: `src/components/ProfilePage/Profile/CategoryBar/Category/Category.module.scss`

**Interfaces:**
- Consumes: Task 2/3/5에서 정의한 `ProfileCoverProps`/`ProfileImageProps`/`ProfileActionsProps`
- Produces: 없음(오케스트레이션 정리) — Task 7이 삭제된 로컬 `Category` import를 더 이상 참조하지 않음을 전제로 한다.

- [ ] **Step 1: `Profile.tsx`에서 미사용 배선 제거**

Modify `src/components/ProfilePage/Profile/Profile.tsx:1-31`(임포트 블록), 기존 임포트 중 아래 3줄을 제거:
```tsx
import { deleteMe } from "@/api/users/deleteMe";
```
그대로 두되(아래에서 handleWithdrawal 자체는 제거하므로 이 줄은 삭제), 나머지 임포트는 유지한다.

Modify `src/components/ProfilePage/Profile/Profile.tsx:33-38`, 기존:
```tsx
export default function Profile({ isMyProfile, id, url }: ProfileProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
```
교체:
```tsx
export default function Profile({ isMyProfile, id, url }: ProfileProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
```

Modify `src/components/ProfilePage/Profile/Profile.tsx:55-59`, 기존:
```tsx
  const { handleFileChange, handleDeleteProfileImage } = useProfileImage(
    refetchUserData,
    setProfileImage,
    userData?.image || "/image/default.svg",
  );
```
교체:
```tsx
  const { handleFileChange } = useProfileImage(
    refetchUserData,
    setProfileImage,
    userData?.image || "/image/default.svg",
  );
```

Modify `src/components/ProfilePage/Profile/Profile.tsx:112-134`, `handleWithdrawal` 함수 전체를 삭제하고 그 자리에 아래 함수로 교체:
```tsx
  const handleOpenAccountSettings = () => {
    router.push("/settings/account");
  };
```

같은 파일 상단 임포트 블록에서 `import { deleteMe } from "@/api/users/deleteMe";` 줄을 삭제한다.

- [ ] **Step 2: JSX props 갱신**

Modify `src/components/ProfilePage/Profile/Profile.tsx:210-267`, 반환 JSX 전체를 아래로 교체:
```tsx
  return (
    <div className={styles.container}>
      {userData && (
        <>
          <ProfileCover
            userData={userData}
            coverImage={coverImage}
            isMyProfile={isMyProfile}
            handleAddCover={handleAddCover}
            handleDeleteImage={handleDeleteImage}
          />
          <section className={styles.infoContainer}>
            <div className={styles.infoWrapper}>
              <ProfileImage
                profileImage={profileImage}
                isMyProfile={isMyProfile}
                handleFileChange={handleFileChange}
              />
              <div className={styles.detailsContainer}>
                <ProfileDetails
                  userData={userData}
                  isMyProfile={isMyProfile}
                  isMobile={isMobile}
                  handleOpenFollowerModal={handleOpenFollowerModal}
                  handleOpenFollowingModal={handleOpenFollowingModal}
                >
                  {isLoggedIn && (
                    <ProfileActions
                      isMyProfile={isMyProfile}
                      isFollowing={userData.isFollowing}
                      isBlocked={userData.isBlocked}
                      isBlocking={userData.isBlocking}
                      handleOpenEditModal={handleOpenEditModal}
                      handleOpenAccountSettings={handleOpenAccountSettings}
                      handleUnfollowClick={handleUnfollowClick}
                      handleFollowClick={handleFollowClick}
                      handleShareProfile={handleShareProfile}
                      handleOpenReportModal={handleOpenReportModal}
                      handleBlockClick={handleBlockClick}
                      handleUnblockClick={handleUnblockClick}
                      handleOpenBlocklistModal={handleOpenBlocklistModal}
                      handleSendMessage={handleSendMessage}
                    />
                  )}
                </ProfileDetails>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
```

> `<Blocklist />` 렌더는 `newModalOpen`을 통해 별도로 열리므로(코드 상단 `handleOpenBlocklistModal` 내부) 이 JSX 트리에는 포함되지 않는다 — 기존과 동일.

- [ ] **Step 3: `Profile.module.scss` 교체**

```scss
@use "@/styles/tokens/colors/semantic" as colors;
@use "@/styles/tokens/spacing" as spacing;
@use "@/styles/breakpoint" as bp;
@use "@/styles/globals.scss" as *;

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: colors.$surface-base;
}

.infoContainer {
  width: 100%;
  position: relative;
  padding: 0 spacing.$spacing-32;
  margin-top: spacing.$spacing-40;

  @include bp.breakpoint-down("md") {
    padding: 0 spacing.$spacing-16;
  }

  @include bp.breakpoint-down("xs") {
    padding: 0 spacing.$spacing-16;
    margin-top: spacing.$spacing-24;
  }
}

.infoWrapper {
  max-width: $max-width-container;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: spacing.$spacing-16;

  @include bp.breakpoint-down("xs") {
    flex-direction: column;
    gap: spacing.$spacing-12;
  }
}

.detailsContainer {
  flex: 1;
  min-width: 0;
}

.blacklist {
  max-width: 604px;
  width: 100%;
}
```

> `$max-width-container`는 `globals.scss`에 정의된 전역 레이아웃 상수이므로 예외적으로 계속 `@use`한다(Global Constraints의 "레거시 믹스인 제거"는 `Size()`/`Body1`류의 타이포·반응형 믹스인에 해당하며, 레이아웃 폭 상수는 RankingPage도 동일하게 `globals.scss`에서 가져온다).

- [ ] **Step 4: 로컬 `Category` 컴포넌트 삭제**

```bash
rm -rf src/components/ProfilePage/Profile/CategoryBar
```

- [ ] **Step 5: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: `Profile.tsx`/`ProfileActions.tsx`/`ProfileCover.tsx`/`ProfileImage.tsx`/`ProfileDetails.tsx`에는 에러 없음. `ProfilePage.tsx`가 아직 삭제된 `./Profile/CategoryBar/Category/Category`를 import하고 있으므로 `ProfilePage.tsx`에서 module-not-found 에러가 나는 것은 이 시점에 정상 — Task 7에서 해결한다.

- [ ] **Step 6: 커밋**

```bash
git add -A src/components/ProfilePage/Profile
git commit -m "Refactor: Profile.tsx 배선 정리 및 레거시 CategoryBar 컴포넌트 제거"
```

---

## Task 7: `ProfilePage.tsx` — 카테고리 칩 + 그림/글 탭 마이그레이션

**Files:**
- Modify: `src/components/ProfilePage/ProfilePage.tsx`
- Modify: `src/components/ProfilePage/ProfilePage.module.scss`

**Interfaces:**
- Consumes: `common/SegmentedControl/Category/Category`(`{active, title, showNumber, number, onClick}`), `common/SegmentedControl/Tab/Tab`(`{active, title, showNumber, number, onClick}`), `common/Button/IconButton/IconButton`

- [ ] **Step 1: import 정리**

Modify `src/components/ProfilePage/ProfilePage.tsx:1-22`, 기존:
```tsx
import { useEffect, useRef, useState } from "react";
import { useUserDataByUrl } from "@/api/users/getId";
import { useUserFeeds } from "@/api/users/getIdFeeds";
import { useUserPosts } from "@/api/users/getIdPosts";
import Profile from "./Profile/Profile";
import styles from "./ProfilePage.module.scss";
import { useModalStore } from "@/states/modalStore";
import { ProfilePageProps } from "./ProfilePage.types";
import ProfileCard from "../Layout/ProfileCard/ProfileCard";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import AllCard from "../Board/BoardAll/AllCard/AllCard";
import Category from "./Profile/CategoryBar/Category/Category";
import FeedAlbumEditor from "./FeedAlbumEditor/FeedAlbumEditor";
import { useDragScroll } from "@/hooks/useDragScroll";
import Icon from "@/components/Asset/IconTemp";
import Pagination from "@/components/Pagination";
import { useDeviceStore } from "@/states/deviceStore";
import useUserBlock from "@/hooks/useUserBlock";
import ToastContainer from "@/components/common/PopUp/Toast/ToastContainer";
```
교체:
```tsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { useUserDataByUrl } from "@/api/users/getId";
import { useUserFeeds } from "@/api/users/getIdFeeds";
import { useUserPosts } from "@/api/users/getIdPosts";
import { useModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useDragScroll } from "@/hooks/useDragScroll";
import useUserBlock from "@/hooks/useUserBlock";

import Profile from "./Profile/Profile";
import { ProfilePageProps } from "./ProfilePage.types";
import FeedAlbumEditor from "./FeedAlbumEditor/FeedAlbumEditor";
import ResponsiveMenu from "./shared/ResponsiveMenu/ResponsiveMenu";

import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import ToastContainer from "@/components/common/PopUp/Toast/ToastContainer";
import Icon from "@/components/common/Icon/Icon";
import Category from "@/components/common/SegmentedControl/Category/Category";
import Tab from "@/components/common/SegmentedControl/Tab/Tab";
import Album from "@/components/common/Card/Album/Album";
import Empty from "@/components/common/Empty/Empty";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Navigation from "@/components/common/Pagination/Navigation/Navigation";

import styles from "./ProfilePage.module.scss";
```

> `Dropdown`/`Button`(Asset)/`ProfileCard`(레거시)/`Pagination`(레거시)/`Link` 임포트는 이번 태스크~Task 9에서 순차 제거된다. `Link`는 이 파일에서 더는 필요 없다(Empty 컴포넌트의 `onButtonClick`에서 `router.push`로 대체 — Task 9).

- [ ] **Step 2: 상태에서 인디케이터 관련 값 제거**

Modify `src/components/ProfilePage/ProfilePage.tsx:34-56`(컴포넌트 내부 상단), 기존:
```tsx
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"feeds" | "posts">(
    (query.tab as "feeds" | "posts") || "feeds",
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const feedsTabRef = useRef<HTMLDivElement>(null);
  const postsTabRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
```
교체:
```tsx
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [activeTab, setActiveTab] = useState<"feeds" | "posts">(
    (query.tab as "feeds" | "posts") || "feeds",
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const loadMoreRef = useRef(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 3: 탭 인디케이터 측정 `useEffect` 삭제**

Modify `src/components/ProfilePage/ProfilePage.tsx:135-160`, 아래 `useEffect` 블록 전체를 삭제한다:
```tsx
  useEffect(() => {
    const activeTabRef = activeTab === "feeds" ? feedsTabRef : postsTabRef;
    if (!activeTabRef.current) return;

    const measureTab = () => {
      if (!activeTabRef.current) return;

      const { offsetWidth, offsetLeft } = activeTabRef.current;
      setIndicatorStyle({ width: offsetWidth, left: offsetLeft });
    };

    const resizeObserver = new ResizeObserver(() => {
      measureTab();
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measureTab();
        resizeObserver.observe(activeTabRef.current!);
      });
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeTab]);
```

- [ ] **Step 4: `handleDropdownToggle` 삭제**

Modify `src/components/ProfilePage/ProfilePage.tsx:193-195`, 아래 함수를 삭제한다(Task 9에서 `ResponsiveMenu`가 열림 상태를 자체 관리하므로 더는 필요 없음):
```tsx
  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };
```

- [ ] **Step 5: 탭 바 + 카테고리 칩 JSX 교체**

Modify `src/components/ProfilePage/ProfilePage.tsx`의 탭 바 블록(기존 `<div className={styles.barWrapper}>...</div>`, 원본 231~257행)을 아래로 교체:
```tsx
          <div className={styles.tabBar}>
            <Tab
              size="lg"
              active={activeTab === "feeds"}
              title="그림"
              number={userData?.feedCount}
              onClick={() => handleTabChange("feeds")}
            />
            {isMyProfile && (
              <Tab
                size="lg"
                active={activeTab === "posts"}
                title="글"
                number={userData?.postCount}
                onClick={() => handleTabChange("posts")}
              />
            )}
          </div>
```

같은 파일의 카테고리 칩 블록(원본 `<div className={\`${styles.categoryBar}\`} ref={categoryBarRef}>...</div>` 부분, 원본 264~281행)을 아래로 교체:
```tsx
                    <div className={styles.categoryBar} ref={categoryBarRef}>
                      <Category
                        active={activeCategory === null}
                        title="전체"
                        onClick={() => handleCategoryClick(null)}
                      />
                      {userData?.albums?.map((album) => (
                        <Category
                          key={album.id}
                          active={activeCategory === album.id}
                          title={album.name}
                          showNumber
                          number={album.feedCount}
                          onClick={() => handleCategoryClick(album.id)}
                        />
                      ))}
                    </div>
```

그 바로 아래 앨범편집 아이콘 버튼(원본 `<button className={styles.addCategoryBtn} ...><Icon icon="folder" /></button>`)을 아래로 교체:
```tsx
                    {isMyProfile && (
                      <IconButton
                        variant="outlined"
                        icon={<Icon name="folder-edit" size={16} />}
                        onClick={handleAddCategoryClick}
                        aria-label="앨범 편집"
                        className={styles.addCategoryBtn}
                      />
                    )}
```

- [ ] **Step 6: `ProfilePage.module.scss`에 새 클래스 추가**

Modify `src/components/ProfilePage/ProfilePage.module.scss` 최상단에 토큰 `@use` 추가(기존 `@use "@/styles/globals.scss" as *;`, `@use "sass:color";` 바로 아래):
```scss
@use "@/styles/tokens/colors/semantic" as colors;
@use "@/styles/tokens/spacing" as spacing;
@use "@/styles/breakpoint" as bp;
```

같은 파일에 아래 클래스를 추가한다(파일 하단, `.dropdownIcon` 규칙 다음):
```scss
.tabBar {
  display: flex;
  align-items: center;
  gap: spacing.$spacing-4;
  padding: 0 spacing.$spacing-32;
  max-width: $max-width-container;
  margin: spacing.$spacing-32 auto 0;

  @include bp.breakpoint-down("md") {
    padding: 0 spacing.$spacing-16;
  }

  @include bp.breakpoint-down("xs") {
    padding: 0;
    margin-top: spacing.$spacing-20;
  }
}
```

> 기존 `.bar`/`.tab`/`.indicator` 규칙은 이제 미사용이 되므로 Task 11(최종 레이아웃 정리)에서 함께 삭제한다 — 지금 지우면 Task 8/9 작업 중 중간 상태의 시각 확인이 어려워지므로 남겨둔다.

- [ ] **Step 7: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: `import Category from "./Profile/CategoryBar/Category/Category"` 관련 module-not-found 에러가 사라짐. `ProfilePage.tsx`에 남아있는 `Dropdown`/`Button`(Asset)/`isDropdownOpen` 등 미사용 참조는 Task 8~9에서 해소되므로 이 시점엔 관련 에러가 남아있을 수 있다.

- [ ] **Step 8: 커밋**

```bash
git add src/components/ProfilePage/ProfilePage.tsx src/components/ProfilePage/ProfilePage.module.scss
git commit -m "Feat: 프로필 카테고리 칩/그림·글 탭 디자인 시스템 마이그레이션"
```

---

## Task 8: `ProfilePage.tsx` — 정렬 컨트롤 + "그림 정리" 진입 버튼 마이그레이션

**Files:**
- Modify: `src/components/ProfilePage/ProfilePage.tsx`
- Modify: `src/components/ProfilePage/ProfilePage.module.scss`

**Interfaces:**
- Consumes: `ResponsiveMenu`(Task 1), `common/Button/TextButton/TextButton`, `common/Icon/Icon`

- [ ] **Step 1: 정렬 트리거 + "그림 정리" 버튼 JSX 교체**

Modify `src/components/ProfilePage/ProfilePage.tsx`의 `rightBar` 블록(원본 289~326행, `{allFeeds.length > 0 && (...)}`) 전체를 아래로 교체:
```tsx
                  {allFeeds.length > 0 && (
                    <div className={styles.rightBar}>
                      {isMyProfile && (
                        <TextButton
                          variant="assistive"
                          size="regular"
                          iconLeft={<Icon name="sort-horizontal" size={16} />}
                          onClick={toggleEditMode}
                        >
                          그림 정리
                        </TextButton>
                      )}
                      <ResponsiveMenu
                        mobileTitle="정렬"
                        trigger={
                          <button type="button" className={styles.sortTrigger}>
                            <span>
                              {sortOptions.find((option) => option.value === sortBy)?.label ??
                                "최신순"}
                            </span>
                            <Icon name="chevron-down" size={16} />
                          </button>
                        }
                        items={sortOptions.map((option) => ({
                          label: option.label,
                          selected: sortBy === option.value,
                          onClick: () => handleSortChange(option.value),
                        }))}
                      />
                    </div>
                  )}
```

- [ ] **Step 2: 미사용 상태/함수 제거**

Task 7에서 이미 `isDropdownOpen`/`handleDropdownToggle`을 제거했다. `dropdownIcon` 관련 JSX(회전 화살표 애니메이션)는 `ResponsiveMenu` 내부 `Menu`가 스스로 열림 상태를 그려주므로 더 이상 필요 없다 — 위 Step 1 교체로 이미 제거되었다.

- [ ] **Step 3: `ProfilePage.module.scss`에 `.sortTrigger` 추가, 미사용 `.dropdownIcon` 삭제**

Modify `src/components/ProfilePage/ProfilePage.module.scss`, 파일 끝의 `.dropdownIcon { ... }` 규칙을 삭제하고 아래로 교체:
```scss
.sortTrigger {
  display: inline-flex;
  align-items: center;
  gap: spacing.$spacing-4;
  height: 40px;
  padding: 0 spacing.$spacing-12;
  border: 1px solid colors.$border-gray-subtle;
  border-radius: 100000px;
  background-color: colors.$surface-base;
  color: colors.$text-gray-normal;
  cursor: pointer;

  @include typo.label-5;
}
```

이 파일 상단 `@use` 목록에 타이포 토큰이 없다면 추가한다:
```scss
@use "@/styles/tokens/typography/semantic" as typo;
```

- [ ] **Step 4: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: `Dropdown`/`Button`(Asset) import가 이제 미사용이면 제거한다 — `ProfilePage.tsx` 상단에 `import Dropdown ...`, `import Button ...` 줄이 남아있지 않은지 확인(Task 7의 Step 1에서 이미 제거했다면 통과).
수동 확인: `npm run dev` 실행 후 아무 프로필 페이지에서 정렬 트리거 클릭 시 데스크탑은 팝오버, `useDeviceStore` 모바일 폭(<768px)에서는 바텀시트로 열리는지 브라우저 리사이즈로 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/components/ProfilePage/ProfilePage.tsx src/components/ProfilePage/ProfilePage.module.scss
git commit -m "Feat: 프로필 정렬 컨트롤 및 그림 정리 버튼 마이그레이션"
```

---

## Task 9: `ProfilePage.tsx` — 피드 그리드(`Card/Album`) + 빈 상태(`Empty`) 마이그레이션

**Files:**
- Modify: `src/components/ProfilePage/ProfilePage.tsx`
- Modify: `src/components/ProfilePage/ProfilePage.module.scss`

**Interfaces:**
- Consumes: `common/Card/Album/Album`(`{variant="mainTitle", imageUrl, title, nickname, likeCount, viewCount, feedHref}`), `common/Empty/Empty`(`{size, iconName, title, buttonLabel, onButtonClick}`)

- [ ] **Step 1: `useRouter` 확보**

`ProfilePage.tsx`는 이미 `const router = useRouter();`를 최상단에서 선언하고 있다(원본 35행) — 그대로 사용한다.

- [ ] **Step 2: 그림 탭 콘텐츠 JSX 교체**

Modify `src/components/ProfilePage/ProfilePage.tsx`의 그림 탭 렌더 블록(원본 329~363행,
```tsx
              {activeTab === "feeds" ? (
                allFeeds.length === 0 ? (
                  isMyProfile ? (
                    ...
                  ) : (
                    ...
                  )
                ) : (
                  <section className={styles.cardContainer}>
                    ...
                  </section>
                )
              ) : (
```
부분)를 아래로 교체:
```tsx
              {activeTab === "feeds" ? (
                allFeeds.length === 0 ? (
                  <Empty
                    size="xl"
                    iconName={isMyProfile ? "illust-upload-success" : "illust-result-null"}
                    title={isMyProfile ? "첫 그림을 업로드해보세요" : "업로드한 그림이 없어요"}
                    buttonLabel={isMyProfile ? "그림 업로드" : undefined}
                    onButtonClick={isMyProfile ? () => router.push("/write") : undefined}
                  />
                ) : (
                  <section className={styles.cardContainer}>
                    {allFeeds.map((feed, index) => (
                      <Album
                        key={`${feed.id}-${index}`}
                        variant="mainTitle"
                        imageUrl={feed.thumbnail}
                        title={feed.title}
                        nickname={userData?.name ?? ""}
                        likeCount={feed.likeCount}
                        viewCount={feed.viewCount}
                        feedHref={`/feeds/${feed.id}`}
                      />
                    ))}
                    {hasNextPage && <div ref={loadMoreRef} />}
                  </section>
                )
              ) : (
```

- [ ] **Step 3: `Link`/레거시 `Button` import 제거 확인**

`ProfilePage.tsx`에서 `import Link from "next/link";`와 레거시 `import Button from "../Button/Button";`가 더 이상 참조되지 않는지 확인한다(글 탭 빈 상태는 Task 10에서 처리). 그림 탭 쪽에서는 이미 제거됐어야 한다 — 남아있다면 삭제한다.

- [ ] **Step 4: `.cardContainer` 그리드를 반응형 열 수로 갱신**

Modify `src/components/ProfilePage/ProfilePage.module.scss`의 `.cardContainer` 규칙(원본 182~199행)을 아래로 교체:
```scss
  .cardContainer {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: spacing.$spacing-24;
    column-gap: spacing.$spacing-16;

    @include bp.breakpoint-only("sm") {
      grid-template-columns: repeat(4, 1fr);
    }

    @include bp.breakpoint-only("md") {
      grid-template-columns: repeat(4, 1fr);
    }

    @include bp.breakpoint-down("xs") {
      grid-template-columns: repeat(2, 1fr);
      row-gap: spacing.$spacing-20;
      column-gap: spacing.$spacing-12;
    }
  }
```

- [ ] **Step 5: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: 에러 없음.
수동 확인: `npm run dev`로 그림이 있는 프로필/없는 프로필을 각각 열어 카드 그리드(데스크탑 5열/태블릿 4열/모바일 2열)와 빈 상태 문구·아이콘(본인은 버튼 포함, 타인은 버튼 없음)이 스펙과 일치하는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/components/ProfilePage/ProfilePage.tsx src/components/ProfilePage/ProfilePage.module.scss
git commit -m "Feat: 프로필 피드 그리드 Card/Album, 빈 상태 Empty로 마이그레이션"
```

---

## Task 10: `ProfilePage.tsx` — 글 탭 빈 상태 + 페이지네이션 마이그레이션

**Files:**
- Modify: `src/components/ProfilePage/ProfilePage.tsx`
- Modify: `src/components/ProfilePage/ProfilePage.module.scss`

**Interfaces:**
- Consumes: `common/Empty/Empty`, `common/Pagination/Navigation/Navigation`(`{currentPage, totalPages, onPageChange}`)

- [ ] **Step 1: 글 탭 콘텐츠 JSX 교체**

Modify `src/components/ProfilePage/ProfilePage.tsx`의 글 탭 렌더 블록(원본 364~395행,
```tsx
              ) : (
                isMyProfile && (
                  <section>
                    {!postsData || postsData.length === 0 ? (
                      ...
                    ) : (
                      <>
                        ...
                        <section className={styles.pagination}>
                          <Pagination ... />
                        </section>
                      </>
                    )}
                  </section>
                )
              )}
```
부분)를 아래로 교체:
```tsx
              ) : (
                isMyProfile && (
                  <section>
                    {!postsData || postsData.length === 0 ? (
                      <Empty
                        size="xl"
                        title="첫 글을 업로드해보세요"
                        buttonLabel="글 업로드"
                        onButtonClick={() => router.push("/board")}
                      />
                    ) : (
                      <>
                        <div className={styles.postContainer}>
                          {postsData.map((post) => (
                            <AllCard key={post.id} post={post} case="my-posts" />
                          ))}
                        </div>
                        {totalPages > 1 && (
                          <section className={styles.pagination}>
                            <Navigation
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={handlePageChange}
                            />
                          </section>
                        )}
                      </>
                    )}
                  </section>
                )
              )}
```

- [ ] **Step 2: 레거시 `Pagination` import 제거**

`ProfilePage.tsx` 상단에서 `import Pagination from "@/components/Pagination";` 줄을 삭제한다(Task 7의 새 import 블록에는 이미 포함되어 있지 않다 — 원본 파일에 남아있었다면 확인 후 제거).

- [ ] **Step 3: `.pagination` 스타일 정리**

Modify `src/components/ProfilePage/ProfilePage.module.scss`의 `.pagination` 규칙(원본 303~350행, 버튼 세부 스타일 포함)을 아래로 교체:
```scss
.pagination {
  margin-top: spacing.$spacing-8;
  display: flex;
  justify-content: center;
  align-items: center;

  @include bp.breakpoint-down("xs") {
    margin-top: spacing.$spacing-28;
    margin-bottom: 70px;
  }
}
```

- [ ] **Step 4: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: 에러 없음. `grep -n "Pagination\|Dropdown\|Asset/IconTemp\|Layout/ProfileCard\|components/Button/Button" src/components/ProfilePage/ProfilePage.tsx`로 레거시 참조가 전부 사라졌는지 확인.
수동 확인: 내 프로필 글 탭에서 11건 이상 글이 있는 계정으로 페이지네이션 동작 확인(2페이지 이상일 때만 노출).

- [ ] **Step 5: 커밋**

```bash
git add src/components/ProfilePage/ProfilePage.tsx src/components/ProfilePage/ProfilePage.module.scss
git commit -m "Feat: 프로필 글 탭 빈 상태 및 페이지네이션 마이그레이션"
```

---

## Task 11: 최종 레이아웃 정리 — 미사용 레거시 CSS 제거 + 컨테이너 폭 반응형

Task 7~10을 거치며 미사용이 된 `.bar`/`.tab`(구 인디케이터 탭)/`.empty`(구 빈 상태) 등 레거시 규칙을 제거하고, `ProfilePage.module.scss`의 최상위 컨테이너 폭을 사이드바 유무에 맞춰 브레이크포인트별로 정리한다.

**Files:**
- Modify: `src/components/ProfilePage/ProfilePage.module.scss` (전체 정리)

- [ ] **Step 1: 파일 전체를 아래 내용으로 교체**

```scss
@use "@/styles/globals.scss" as *;
@use "@/styles/tokens/colors/semantic" as colors;
@use "@/styles/tokens/typography/semantic" as typo;
@use "@/styles/tokens/spacing" as spacing;
@use "@/styles/breakpoint" as bp;

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .feedContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: $max-width-container;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: spacing.$spacing-56;

    @include bp.breakpoint-down("xs") {
      padding-bottom: spacing.$spacing-40;
    }

    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      row-gap: spacing.$spacing-12;
      margin-top: spacing.$spacing-12;
      margin-bottom: spacing.$spacing-16;

      @include bp.breakpoint-down("xs") {
        flex-direction: column;
        align-items: flex-start;
        gap: spacing.$spacing-8;
      }

      .categoryContainer {
        display: flex;
        align-items: center;
        min-width: 0;
        flex: 1 1 auto;
        max-width: 100%;
        gap: spacing.$spacing-8;

        @include bp.breakpoint-down("xs") {
          width: 100%;
          justify-content: space-between;
        }
      }

      .categoryBar {
        min-width: 0;
        overflow-x: auto;
        display: flex;
        align-items: center;
        gap: spacing.$spacing-8;

        @include bp.breakpoint-down("xs") {
          gap: spacing.$spacing-4;
        }

        &::-webkit-scrollbar {
          display: none;
        }

        & > * {
          flex-shrink: 0;
        }
      }

      .addCategoryBtn {
        flex-shrink: 0;
      }
    }

    .rightBar {
      display: flex;
      align-items: center;
      gap: spacing.$spacing-10;
      flex-shrink: 0;

      @include bp.breakpoint-down("xs") {
        width: 100%;
        justify-content: flex-end;
        margin-top: spacing.$spacing-8;
      }
    }
  }

  .cardContainer {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: spacing.$spacing-24;
    column-gap: spacing.$spacing-16;

    @include bp.breakpoint-only("sm") {
      grid-template-columns: repeat(4, 1fr);
    }

    @include bp.breakpoint-only("md") {
      grid-template-columns: repeat(4, 1fr);
    }

    @include bp.breakpoint-down("xs") {
      grid-template-columns: repeat(2, 1fr);
      row-gap: spacing.$spacing-20;
      column-gap: spacing.$spacing-12;
    }
  }
}

.wrapper {
  width: 100%;
  padding: 0 spacing.$spacing-32;
}

.barWrapper {
  @extend .wrapper;

  @include bp.breakpoint-down("xs") {
    padding: 0;
  }
}

.feed {
  @extend .wrapper;

  @include bp.breakpoint-down("xs") {
    padding: 0 spacing.$spacing-16;
  }
}

.tabBar {
  display: flex;
  align-items: center;
  gap: spacing.$spacing-4;
  padding: 0 spacing.$spacing-32;
  max-width: $max-width-container;
  margin: spacing.$spacing-32 auto 0;

  @include bp.breakpoint-down("md") {
    padding: 0 spacing.$spacing-16;
  }

  @include bp.breakpoint-down("xs") {
    padding: 0;
    margin-top: spacing.$spacing-20;
  }
}

.sortTrigger {
  display: inline-flex;
  align-items: center;
  gap: spacing.$spacing-4;
  height: 40px;
  padding: 0 spacing.$spacing-12;
  border: 1px solid colors.$border-gray-subtle;
  border-radius: 100000px;
  background-color: colors.$surface-base;
  color: colors.$text-gray-normal;
  cursor: pointer;

  @include typo.label-5;
}

.postContainer {
  padding-top: spacing.$spacing-32;
  padding-bottom: spacing.$spacing-40;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: spacing.$spacing-20;

  @include bp.breakpoint-down("xs") {
    padding-top: spacing.$spacing-16;
    padding-bottom: spacing.$spacing-16;
  }
}

.pagination {
  margin-top: spacing.$spacing-8;
  display: flex;
  justify-content: center;
  align-items: center;

  @include bp.breakpoint-down("xs") {
    margin-top: spacing.$spacing-28;
    margin-bottom: 70px;
  }
}

.editModeContainer {
  width: 100%;
  padding-bottom: 80px;
}

.albumInfo {
  margin: spacing.$spacing-24 0;

  .feedCount {
    @include typo.body-1-r;
    color: colors.$text-gray-subtle;
  }
}

.editFooter {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: colors.$surface-base;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 spacing.$spacing-24;
  z-index: 100;

  .leftActions {
    display: flex;
    align-items: center;
  }

  .rightActions {
    display: flex;
    align-items: center;
    gap: spacing.$spacing-12;
  }

  @include bp.breakpoint-down("xs") {
    height: 56px;
    padding: 0 spacing.$spacing-16;
  }
}
```

> `.bar`/`.tab`/`.indicator`/`.empty`(구 커스텀 빈 상태)/`.dropdownIcon` 규칙은 Task 7~9에서 대응 컴포넌트가 `Tab`/`Empty`/`ResponsiveMenu`로 완전히 교체되어 더는 어떤 JSX에서도 참조하지 않으므로 이 전체 교체에서 함께 제거된다. `.editModeContainer`/`.albumInfo`/`.editFooter`는 `FeedAlbumEditor`(그림 정리 모드, 이번 스코프 제외)가 계속 참조하므로 유지한다.

- [ ] **Step 2: `FeedAlbumEditor`가 참조하는 클래스가 남아있는지 확인**

Run: `grep -n "styles\." src/components/ProfilePage/FeedAlbumEditor/FeedAlbumEditor.tsx`
Expected: 여기서 참조하는 클래스(`editModeContainer` 등은 `FeedAlbumEditor.module.scss` 자체 파일을 쓰므로 무관)가 `ProfilePage.module.scss`의 것이 아님을 확인 — `FeedAlbumEditor`는 자신의 `.module.scss`를 따로 갖고 있으므로 영향 없다.

- [ ] **Step 3: 검증**

Run: `npm run lint && npx tsc --noEmit`
Expected: 에러 없음.
수동 확인: `npm run dev`로 브라우저 폭을 1200px 이상/768~1199px/768px 미만으로 각각 조절하며 프로필 페이지 전체(커버, 아바타, 이름/통계, 액션 버튼, 탭, 카테고리 칩, 정렬, 피드 그리드, 빈 상태, 글 탭 페이지네이션)를 Figma 3종 프레임과 비교한다. 내 프로필/타 프로필/차단함/차단당함 계정으로 각각 접속해 Profile Actions와 더보기 메뉴 항목이 스펙의 상태 매트릭스와 일치하는지 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add src/components/ProfilePage/ProfilePage.module.scss
git commit -m "Refactor: 프로필 페이지 레거시 CSS 정리 및 반응형 레이아웃 마무리"
```

---

## Self-Review 메모

- **스펙 커버리지**: 스펙의 "포함" 항목(커버/아바타/이름·통계/액션·더보기/탭/카테고리/정렬/그림정리 진입/피드그리드/글탭·페이지네이션/빈 상태) 전부 Task 1~11에 매핑됨. "제외" 항목(모달 내부, 그림정리·앨범편집 화면 내부, AllCard)은 어떤 태스크에서도 건드리지 않음.
- **스펙과의 차이(사용자 확인 필요, 이번 플랜에서는 스펙을 그대로 따름)**: Figma 데이터상 글(게시물) 탭이 타 유저 프로필에서도 빈 상태로 노출되는 정황이 있었으나, 승인된 스펙은 "글 탭은 내 프로필 전용"으로 명시했고 현재 API 훅 구조(`useUserPosts`가 `isMyProfile`일 때만 활성화)도 이를 전제로 한다 — 이번 플랜은 스펙대로 내 프로필 전용을 유지했다. 글 탭을 타 유저에게도 공개할지는 별도 확인 후 Phase 2/3 스펙에서 다룰 것을 권장.
- **타입 일관성**: `ProfileCoverProps`(userId→isMyProfile), `ProfileImageProps`(isMobile 제거, handleDeleteProfileImage 제거), `ProfileActionsProps`(handleWithdrawal 제거, handleOpenAccountSettings 추가)가 Task 2/3/5의 정의와 Task 6의 `Profile.tsx` 호출부에서 동일하게 사용됨을 확인함.
- **플레이스홀더 스캔**: 전 태스크에 TBD/TODO 없음. 모든 코드 블록은 그대로 붙여넣기 가능한 완전한 코드임.

---

**Plan complete and saved to `docs/superpowers/plans/2026-08-09-profile-main-page-design-system.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - 태스크마다 새 서브에이전트를 띄워 진행, 태스크 사이마다 리뷰, 빠른 반복

**2. Inline Execution** - 이 세션에서 배치 단위로 실행, 체크포인트마다 리뷰

**Which approach?**
