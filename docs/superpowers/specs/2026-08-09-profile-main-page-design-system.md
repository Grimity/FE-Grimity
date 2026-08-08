# 프로필 메인 화면 디자인 시스템 마이그레이션 (Phase 1/3)

## 배경

Grimity 전반에 디자인 시스템(`src/components/common`)이 도입되어 GNB/Sidebar/알림/랭킹/저장 피드 등이 순차적으로 마이그레이션됐다. 이번 작업은 프로필 영역(`src/components/ProfilePage/`) 차례이며, 다음 Figma 프레임을 기준으로 한다.

- 데스크탑: https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12733&m=dev
- 태블릿: https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-331840&m=dev
- 모바일: https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-235672&m=dev

Figma의 "내 프로필" / "타 유저 프로필" 섹션은 메인 화면 외에 프로필 편집·아바타/커버 수정·공유·링크 목록 모달, 앨범 편집 화면, 그림 정리 모드, 차단 상태까지 포함하는 큰 범위다. 한 번에 설계하기엔 크므로 아래처럼 순서를 나눴다.

1. **메인 프로필 화면** (본 스펙)
2. 프로필 관련 모달(편집/아바타·커버 수정/공유/링크 목록)
3. 부가 플로우(앨범 편집, 그림 정리 모드, 차단/차단됨 상세 상태)

## 1. 범위 & 목표

**대상**: `src/components/ProfilePage/Profile/*` 트리 전체를 디자인 시스템 컴포넌트로 마이그레이션 + 반응형 대응(데스크탑 ≥1200px / 태블릿 768~1199px / 모바일 <768px), 기존 `src/pages/[url].tsx` 라우트에 그대로 연결.

**포함**:
- 커버 이미지, 아바타(+편집 뱃지), 이름, 팔로워/팔로잉 카운트, 소개글, 외부 링크 목록(+"외 링크 N개")
- 프로필 액션 버튼 영역: 내 프로필(편집+더보기) / 타인 프로필(팔로우·팔로잉+더보기) / 차단함·차단당함 변형
- 그림/글 탭(카운트 배지 포함)
- 카테고리(앨범) 필터 칩 바 + 앨범편집 진입 아이콘 (아이콘 새 디자인, 클릭 시 기존 앨범편집 화면 그대로 연결)
- 정렬 필터, "그림 정리" 진입 버튼 (버튼 새 디자인, 클릭 시 기존 그림정리 화면 그대로 연결)
- 피드 카드 그리드(`common/Card/Album`으로 교체, 데스크탑 5열 / 태블릿 4열 / 모바일 2열, 정사각 썸네일)
- 글(게시물) 리스트 + 페이지네이션 (내 프로필 전용)
- 빈 상태(그림 없음/글 없음, 내 프로필·타 프로필 문구 분기)
- 더보기(⋯) 메뉴: 데스크탑/태블릿은 `Navigation/Menu` 팝오버, 모바일은 `PopUp/BottomSheet`

**제외** (별도 스펙 예정):
- 프로필 편집/아바타·커버 수정/공유/링크 목록 모달 **내부** 디자인 (트리거 버튼만 새 디자인)
- 그림 정리 모드 화면, 앨범 편집 화면 **내부** 디자인 (진입 버튼/아이콘만 새 디자인)
- 글 탭의 게시물 카드(`Board/BoardAll/AllCard`) — 보드 기능과 공유되는 컴포넌트라 이번 스코프에서 제외, 기존 그대로 사용

**성공 기준**: 레거시 `Button`(`@/components/Button`)/`Dropdown`/`Icon`(`Asset/IconTemp`)/`Pagination`(`@/components/Pagination`) 의존성을 프로필 메인 화면에서 제거하고 `src/components/common` 컴포넌트만 사용, 3개 브레이크포인트에서 Figma와 시각적으로 일치, 기존 API/훅/상태 로직(`useUserDataByUrl`, `useUserFeeds`, `useUserPosts`, `useFollow`, `useCoverImage`, `useProfileImage`, `useUserBlock` 등)은 그대로 재사용 — 새 기능/API 변경 없음.

## 2. 레이아웃 구조 & 반응형 전략

앱 전역 레이아웃(`Layout.tsx`)이 이미 GNB/Sidebar를 디자인 시스템으로 마이그레이션 완료했으므로, ProfilePage는 콘텐츠 영역만 처리하면 된다.

**브레이크포인트**: 기존 `src/styles/breakpoint`의 `bp.breakpoint-down("md"|"xs")` 믹스인과 `globals.scss`의 `$sidebar-width`(258px) / `$sidebar-width-tablet`(80px) / `$max-width-container`(1280px)를 그대로 사용 — RankingPage 마이그레이션과 동일한 패턴.

- **데스크탑** (≥1200px, `lg`): 사이드바 258px. 피드 그리드 5열, 정사각 썸네일.
- **태블릿** (768~1199px, `sm`+`md`): 사이드바 80px(아이콘 전용, 이미 앱 레이아웃에서 처리됨). 피드 그리드 4열.
- **모바일** (<768px, `xs`): 사이드바 없음(GNB 컴팩트 `Xs` 버전, 이미 Layout에서 처리됨). 피드 그리드 2열. 더보기/정렬/링크 등은 팝오버 대신 바텀시트로 전환.

**구현 방식**: 레이아웃/여백/그리드 열 수는 SCSS `@include bp.breakpoint-down()`으로 순수 CSS 처리(컴포넌트 트리는 하나). 컴포넌트 자체가 바뀌는 지점(더보기 메뉴: `Menu` ↔ `BottomSheet`, 편집 모달: `Modal` ↔ `isFill` 바텀시트형)만 기존처럼 `useDeviceStore().isMobile`로 분기.

## 3. 컴포넌트 교체 매핑

| 영역 | 기존 (레거시) | 신규 (`common/`) |
|---|---|---|
| 커버 이미지 | `<img>` + 커스텀 버튼 | `Thumbnail` + `IconButton`(카메라/X 오버레이) + `SolidButton`("커버 추가하기") |
| 아바타 | `ResponsiveImage` 80/140px | `Avatar`(`size={80}` 고정 — 데스크탑도 80px) + `IconButton`(연필 편집 뱃지) |
| 팔로워/팔로잉 카운트 | 커스텀 div | `Cell/UserInfo`(`type="follow"`) |
| 프로필 액션(편집/팔로우/팔로잉/더보기) | `Button`(Asset) + `Dropdown` | `OutlinedButton` / `SolidButton` + `Navigation/Menu`(데스크탑·태블릿) / `PopUp/BottomSheet`(모바일) |
| 소개글 + 외부 링크 | 커스텀 div/Link | `Cell/UserItem`(`type="link"`), "외 링크 N개"는 텍스트 트리거 유지 |
| 그림/글 탭 | 커스텀 div + JS 인디케이터 계산 | `SegmentedControl/Tab`(active/number 내장 — JS 인디케이터 로직 제거) |
| 카테고리(앨범) 칩 | 이미 `Category`(신규) 사용 중 | 그대로 유지 |
| 앨범편집 진입 아이콘 | `Icon`(Asset/IconTemp) | `IconButton` |
| 정렬 필터 | `Dropdown` | `Filter` |
| "그림 정리" 진입 버튼 | `Icon` + text | `TextButton`(iconLeft) |
| 피드 카드 | `Layout/ProfileCard`(레거시) | `Card/Album`(`variant="mainTitle"`) |
| 빈 상태 | 커스텀 div | `Empty` |
| 페이지네이션(글 탭) | `components/Pagination`(레거시) | `common/Pagination`(`Navigation`+`Counter`) |
| 아이콘 전반 | `Asset/IconTemp` | `common/Icon` |

더보기(⋯) 메뉴의 Menu ↔ BottomSheet 반응형 분기는 새 공통 추상화를 만들지 않고, 같은 패턴을 쓰는 `ShareModal.tsx`의 구현 방식을 따른다.

**아이콘 확인 완료**: Figma에서 쓰인 아이콘(dotmenu, sort-horizontal, folder-edit, pen, camera, x, plus, link, danger-circle 등) 모두 `common/Icon`의 `IconName`에 이미 존재 — 신규 아이콘 에셋 추가 불필요.

## 4. 상태 매트릭스

### Profile Actions & 더보기 메뉴

| 상황 | Profile Actions | 더보기 메뉴 항목 |
|---|---|---|
| 내 프로필 | `편집` 아웃라인 버튼 + 더보기 | 내 계정 설정(→`/settings/account`), 차단 목록 |
| 타 프로필 (일반) | `팔로우`(solid) / `팔로잉 중`(outlined) 버튼 + 더보기 | 프로필 링크 공유, 메시지 보내기, 차단하기, 신고하기 |
| 차단당함 (상대가 나를 차단) | 팔로우 버튼 없음, 더보기만 | 프로필 링크 공유, 신고하기 + 상단 "차단된 계정이에요" 토스트 |
| 차단함 (내가 상대를 차단) | 팔로우 버튼 없음, 더보기만 | 프로필 링크 공유, 차단해제, 신고하기 |

> 참고: 내 프로필 더보기에서 기존의 "프로필 공유"/"회원 탈퇴" 항목은 제거된다(회원탈퇴는 이미 `/settings/account`로 이동됨, 공유는 이번 Figma에 없음). 별도 공유 버튼이 필요한지는 Phase 2(모달) 스펙에서 재확인한다.

### 빈 상태 (`Empty` 컴포넌트, 그림/글 탭 공통 패턴)

| 탭 | 내 프로필 | 타 프로필 |
|---|---|---|
| 그림 | "첫 그림을 업로드해보세요" + `그림 업로드` 버튼 | "업로드한 그림이 없어요" (버튼 없음) |
| 글 | "첫 글을 업로드해보세요" + `글 업로드` 버튼 | "업로드한 글이 없어요" (버튼 없음) |

카테고리(앨범) 필터로 좁혀본 결과가 0건일 때도 동일한 `Empty` 패턴을 재사용(문구만 조정).

## 5. 파일 구조 & 구현 방침

기존 폴더 구조를 유지하며 내부 마크업/스타일만 교체(신규 폴더 생성 안 함, RankingPage 마이그레이션과 동일 패턴):

```
src/components/ProfilePage/
├── ProfilePage.tsx / .module.scss   # 탭 전환, 카테고리 바, 정렬, 그림/글 리스트, 그리드
└── Profile/
    ├── Profile.tsx                   # 오케스트레이션 (변경 적음)
    ├── ProfileCover/                 # Thumbnail + IconButton 오버레이로 교체
    ├── ProfileImage/                 # Avatar + IconButton 뱃지로 교체
    ├── ProfileDetails/                # Cell/UserInfo, Cell/UserItem으로 교체
    ├── ProfileActions/                # Button + Menu/BottomSheet 반응형 분기
    └── CategoryBar/Category/          # 이미 신규 컴포넌트 사용 중 — 변경 없음
```

## 6. 검증 계획

- `npm run lint` / TypeScript 타입체크 통과
- Storybook에서 교체된 개별 컴포넌트(Card/Album, Empty, UserInfo 등) 사용 확인
- 개발 서버 구동 후 브라우저에서 실제 프로필 URL로 3개 브레이크포인트(1200px+/768~1199px/<768px) 육안 확인: 내 프로필/타 프로필/차단/차단됨/빈 상태 각각
- 기존 동작(팔로우 토글, 이미지 업로드, 무한스크롤, 탭 전환, 정렬, 카테고리 필터) 회귀 없는지 수동 확인
