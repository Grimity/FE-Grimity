# 프로필 전체 화면 Figma 구현 스펙 (Phase 2 — 전 화면 대조/구현)

- Figma 페이지: [프로필 `976:418950`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=976-418950&m=dev)
  - 웹 섹션 `1:12733` · 태블릿 섹션 `1:331840` · 모바일 섹션 `1:235672`
- 선행 스펙: [2026-08-09-profile-main-page-design-system.md](./2026-08-09-profile-main-page-design-system.md) (Phase 1 — 메인 화면 마이그레이션, 대부분 반영됨)
- 작성일: 2026-10-02

## 1. 목표

Figma "프로필" 페이지의 **모든 프레임(웹 64 · 태블릿 64 · 모바일 44 = 172개)** 을 코드와 1:1로 대조해서, 차이가 있으면 디자인 시스템 컴포넌트(`src/components/common`)로 맞춘다. 상당수 화면은 이미 이전 커밋에서 마이그레이션됐으므로 이번 단계의 기본 작업은 **"Figma 대조 → 차이 수정"** 이고, 아직 없는 화면/상태만 새로 구현한다.

## 2. 공통 규칙

1. **디자인 시스템 우선**: `docs/design-system.md` 목록의 컴포넌트를 먼저 쓴다. Figma 인스턴스 이름과 코드 컴포넌트 대응은 아래와 같다.

   | Figma 인스턴스 | 코드 |
   |---|---|
   | `Button/Solid` · `Button/Outlined` · `Button/Text` · `Button/Icon` | `common/Button` — `SolidButton` · `OutlinedButton` · `TextButton` · `IconButton` |
   | `Cell/User Info` · `Cell/UserItem` · `Cell/ListItem` | `common/Cell` — `UserInfo` · `UserItem` · `ListItem` |
   | `Tab/Tab` · `Category/Category` | `common/SegmentedControl` — `Tab` · `Category` |
   | `Filter/Filter` · `Dropdown/Dropdown` | `common/Filter` (Dropdown은 Filter 또는 기존 커스텀 드롭다운 — 화면별 확인) |
   | `Card/Album` | `common/Card/Album` |
   | `Empty State` | `common/Empty` |
   | `Input` | `common/Input` (`TextField` 등) |
   | `PopUP/Modal/*` · `Bottom sheet/*` · `PopUP/Alert` · `Toast alert` | `common/PopUp` — `Modal` · `BottomSheet` · `Alert` · `Toast` |
   | `GNB/Menu` | `common/Navigation/Menu` (모바일은 `BottomSheet`, `ProfilePage/shared/ResponsiveMenu` 재사용) |

2. **공통 컴포넌트가 Figma와 다르면** 화면 쪽에서 덮어쓰지 말고 공통 컴포넌트를 고친다(Storybook 확인). 단, 다른 화면에 영향이 가면 별도 커밋으로 나눈다.
3. **SCSS 토큰**: `@use "@/styles/tokens/..."`로만 사용한다(raw CSS 변수 금지, CLAUDE.md 참고).
4. **반응형**: 데스크탑 ≥1200 / 태블릿 768~1199 / 모바일 <768. 레이아웃 차이는 `bp.breakpoint-down()`, 컴포넌트 자체가 바뀌는 곳(Menu↔BottomSheet, Modal↔풀스크린)만 `useDeviceStore().isMobile`로 분기한다.
5. **기존 로직 유지**: API·훅·상태 로직은 재사용한다. 새 API가 필요한 경우(예: 타 유저 글 북마크)는 구현 전에 확인한다.

## 3. 작업 절차 (화면 1개 단위)

1. 표의 node-id로 `get_design_context` 호출 (웹 → 태블릿 → 모바일 순)
2. 해당 코드 위치를 열어 구조·간격·타이포·컴포넌트·문구 차이를 목록으로 정리
3. 수정 → `npm run lint` + 타입체크 → dev 서버에서 3개 브레이크포인트로 확인
4. 표의 상태 칸 업데이트: ⬜ 미확인 → 🔄 진행 중 → ✅ 일치(수정 완료) / ➖ 해당 없음
5. 차이 1건당 커밋 1개 (`Fix: … Figma와 다른 문제 수정` 형식 유지)

## 4. 디자이너 노트 (확인 필요 메모)

| 노트 node-id | 대상 | 내용 | 작업 단위 |
|---|---|---|---|
| `1:14589` (웹) · `1:237049` (모바일) · `1:333666` (태블릿) | 팔로우/팔로잉 리스트의 하트 | 선택할 수 있고, 선택하면 좋아요한 그림에 추가된다 | W3 |
| `1:14589` | 하단 간격 | 기본 하단 여백은 20px. 그림·글이 있으면 그림/글 영역 하단 여백이 72px | W1 · W4 |
| `1:14599` | 타 유저의 글 목록 | 타 유저 글 목록에서 **북마크 기능**을 사용할 수 있어야 한다 | W4 |
| `1:14620` · `1:333687` · `1:237070` | 프로필 수정 모달 | 제목과 하단 버튼을 뺀 나머지 영역만 스크롤된다 ([DS 가이드](https://www.figma.com/design/P1ouNc7cOpjW3MDU3wYdvI?node-id=11138-187927)) | W6 |
| `1:14620` | 프로필 이미지 수정 | 프로필 이미지 영역만 눌러도 이미지 변경 모달이 열린다 | W7 |
| `1:14630` · `1:333697` · `1:237080` | 앨범 | 앨범이 8개가 되면 새 앨범 입력 필드를 비활성화한다 ([DS 가이드](https://www.figma.com/design/P1ouNc7cOpjW3MDU3wYdvI?node-id=11138-187927)) | W8 |

> 태블릿·모바일 노트는 웹 노트와 같은 내용으로 보이지만, 해당 단위를 작업할 때 다시 열어서 확인한다.

## 5. 작업 단위 & 병렬화

| 단위 | 범위 | 주요 코드 위치 | 병렬 가능 |
|---|---|---|---|
| **W1** | 내 프로필 메인 (첫 진입·내용있음·폴더 빈 상태·글 탭·정렬 필터) | `ProfilePage/ProfilePage.tsx`, `Profile/*`, `FeedsSection`, `PostsSection` | ❌ 메인 워크트리 (W2·W4·W5와 파일 공유) |
| **W2** | 내 프로필 더보기 메뉴·프로필 공유·링크 목록·링크 복사 토스트 | `Profile/ProfileActions`, `shared/ResponsiveMenu`, `ShareModal`, `Modal/ProfileLink` | ❌ W1 다음 |
| **W3** | 팔로잉·팔로워·차단 목록 모달 (빈/있음, 하트) | `Modal/Follow`, `Modal/Blocklist` | ✅ 독립 |
| **W4** | 타 유저 프로필 메인 (첫 진입·내용있음·폴더 빈 상태·글 탭 + 북마크) | W1과 같은 파일 + `PostsSection` | ❌ W1 다음 |
| **W5** | 타 유저 더보기·차단함·차단당함 (토스트) | `Profile/ProfileActions`, `useUserBlock` | ❌ W2 다음 |
| **W6** | 프로필 수정 모달 (내용 입력·링크 추가·순서 변경·스크롤·외부 링크 필터, 모바일 풀스크린/바텀시트) | `Modal/ProfileEdit` | ✅ 독립 |
| **W7** | 커버 수정·프로필 이미지 수정 모달 + 수정 완료 토스트 | `Modal/Background`, `hooks/useCoverImage`, `hooks/useProfileImage`, `Profile/ProfileImage` | ⚠️ 거의 독립 (`ProfileImage` 클릭 영역만 W1과 겹침) |
| **W8** | 앨범 편집 페이지 (작성·에러·삭제·순서 편집·이름 변경·8개 제한) | `ProfilePage/AlbumEditor` | ✅ 독립 |
| **W9** | 그림 정리 모드 (앨범명 변경·앨범 이동·그림 삭제·완료 토스트) | `ProfilePage/FeedAlbumEditor`, `Modal/AlbumMove`, `Modal/AlbumDelete`, `Modal/AlbumSelect` | ✅ 독립 |

**진행 순서 제안**
- 메인 워크트리(순차): W1 → W2 → W4 → W5 → W7
- 하위 워크스페이스(병렬, `/orchestration`): W3 · W6 · W8 · W9 — 각자 별도 브랜치로 작업한 뒤 `feature/profile-design-system`에 머지
- 병렬 작업을 시작하기 전에 현재 미커밋 변경을 커밋해서 모든 워크스페이스가 같은 기준점에서 시작하게 한다.

## 6. 화면별 node-id

> 링크는 Figma dev mode로 열린다. "주요 구성"은 프레임 안 인스턴스 요약이고, 같은 이름의 프레임(예: `프로필_더보기`)을 구분할 때 쓴다.

### W1. 내 프로필 메인

> `프로필_필터`(`1:14407`, `1:333486`)는 정렬 필터 메뉴가 열린 상태다. 모바일 `프로필_내용있음` 중 `Empty`가 있는 프레임(`1:236707`)은 폴더(앨범)가 빈 상태다.

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 프로필 첫 진입 | [`1:12734`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12734&m=dev) | 1200×948 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 웹 | 프로필_내용있음 | [`1:12803`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12803&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12 | ⬜ |
| 웹 | 프로필_폴더에 내용없음 | [`1:14323`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14323&m=dev) | 1200×1005 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Empty | ⬜ |
| 웹 | 프로필 첫 진입_글 | [`1:14544`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14544&m=dev) | 1200×872 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 웹 | 프로필_내용있음 | [`1:14471`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14471&m=dev) | 1200×720 | Cell/UserItem×10, Tab/Tab, Filter/Filter | ⬜ |
| 웹 | 프로필_필터 | [`1:14407`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14407&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 태블릿 | 프로필 첫 진입 | [`1:331841`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-331841&m=dev) | 768×1024 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 태블릿 | 프로필_내용있음 | [`1:331994`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-331994&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12 | ⬜ |
| 태블릿 | 프로필_폴더에 내용없음 | [`1:333402`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333402&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Empty | ⬜ |
| 태블릿 | 프로필 첫 진입_글 | [`1:333621`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333621&m=dev) | 768×1024 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 태블릿 | 프로필_내용있음 | [`1:333550`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333550&m=dev) | 768×1024 | Cell/UserItem×9, Tab/Tab, Filter/Filter | ⬜ |
| 태블릿 | 프로필_필터 | [`1:333486`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333486&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 모바일 | 프로필 첫 진입 | [`1:235673`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-235673&m=dev) | 360×800 | Tab/Tab, Category/Category, Filter/Filter, Empty | ⬜ |
| 모바일 | 프로필_내용있음 | [`1:235779`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-235779&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12 | ⬜ |
| 모바일 | 프로필_내용있음 | [`1:236707`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236707&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Empty | ⬜ |
| 모바일 | 프로필 첫 진입_글 | [`1:236966`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236966&m=dev) | 360×800 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 모바일 | 프로필_내용있음 | [`1:236828`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236828&m=dev) | 360×800 | Cell/UserItem×10, Tab/Tab, Filter/Filter | ⬜ |


### W2. 내 프로필 더보기 · 공유 · 링크

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 프로필_더보기 | [`1:13669`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13669&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 웹 | 프로필_링크 | [`1:13850`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13850&m=dev) | 1200×720 | Cell/UserItem×9, Tab/Tab, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 웹 | 프로필_프로필 공유 | [`1:13786`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13786&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Modal, Cell/ListItem×3 | ⬜ |
| 웹 | 링크 복사 | [`1:12859`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12859&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 태블릿 | 프로필_더보기 | [`1:332860`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332860&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 태블릿 | 프로필_링크 | [`1:333041`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333041&m=dev) | 768×1024 | Cell/UserItem×9, Tab/Tab, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 태블릿 | 프로필_프로필 공유 | [`1:332977`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332977&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Modal, Cell/ListItem×3 | ⬜ |
| 태블릿 | 프로필_내용있음 (= 링크 복사 토스트) | [`1:332050`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332050&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 모바일 | 프로필_더보기 | [`1:235924`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-235924&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, BottomSheet, Cell/ListItem×2 | ⬜ |
| 모바일 | 프로필_더보기 | [`1:236626`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236626&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, BottomSheet, Cell/ListItem×3 | ⬜ |
| 모바일 | 프로필_더보기 | [`1:236387`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236387&m=dev) | 360×800 | Cell/UserItem×9, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, BottomSheet | ⬜ |
| 모바일 | 프로필_공유 | [`1:236471`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236471&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, BottomSheet, Cell/ListItem×3 | ⬜ |
| 모바일 | 링크 복사 | [`1:236552`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236552&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, Toast | ⬜ |


### W3. 팔로잉 · 팔로워 · 차단 목록

> 모바일은 Figma 프레임 이름이 전부 `_정보 없음`이지만, `Cell/UserItem`이 있는 프레임(`1:238739`, `1:238811`, `1:238880`)은 실제로는 **정보 있음** 상태다. 모바일은 모달이 아니라 전체 화면이다.

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 팔로잉_정보 없음 | [`1:13917`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13917&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab×2, Filter/Filter, Card/Album×12, Modal, Empty | ⬜ |
| 웹 | 팔로잉_정보 있음 | [`1:14102`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14102&m=dev) | 1200×720 | Cell/UserItem×12, Tab/Tab×2, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 웹 | 팔로워_정보 없음 | [`1:13979`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13979&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab×2, Filter/Filter, Card/Album×12, Modal, Empty | ⬜ |
| 웹 | 팔로워_정보 있음 | [`1:14176`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14176&m=dev) | 1200×720 | Cell/UserItem×12, Tab/Tab×2, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 웹 | 차단_정보 없음 | [`1:14041`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14041&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Modal, Empty | ⬜ |
| 웹 | 차단_정보 있음 | [`1:14250`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14250&m=dev) | 1200×720 | Cell/UserItem×12, Tab/Tab, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 태블릿 | 팔로잉_정보 없음 | [`1:331877`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-331877&m=dev) | 768×1024 | Tab/Tab×2, Filter/Filter, Empty×2, Modal | ⬜ |
| 태블릿 | 팔로잉_정보 있음 | [`1:333108`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333108&m=dev) | 768×1024 | Cell/UserItem×16, Tab/Tab×2, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 태블릿 | 팔로워_정보 없음 | [`1:331919`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-331919&m=dev) | 768×1024 | Tab/Tab×2, Filter/Filter, Empty×2, Modal | ⬜ |
| 태블릿 | 팔로워_정보 있음 | [`1:333186`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333186&m=dev) | 768×1024 | Cell/UserItem×16, Tab/Tab×2, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 태블릿 | 차단_정보 없음 | [`1:333341`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333341&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Modal, Empty | ⬜ |
| 태블릿 | 차단_정보 있음 | [`1:333264`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333264&m=dev) | 768×1024 | Cell/UserItem×16, Tab/Tab, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 모바일 | 팔로잉_정보 없음 | [`1:237087`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237087&m=dev) | 360×800 | Tab/Tab, Empty | ⬜ |
| 모바일 | 팔로잉_정보 없음 | [`1:238739`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238739&m=dev) | 360×800 | Tab/Tab, Cell/UserItem×15 | ⬜ |
| 모바일 | 팔로워_정보 없음 | [`1:238784`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238784&m=dev) | 360×800 | Tab/Tab, Empty | ⬜ |
| 모바일 | 팔로워_정보 없음 | [`1:238811`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238811&m=dev) | 360×800 | Tab/Tab, Cell/UserItem×13 | ⬜ |
| 모바일 | 차단목록_정보 없음 | [`1:238854`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238854&m=dev) | 360×800 | Empty | ⬜ |
| 모바일 | 차단목록_정보 없음 | [`1:238880`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238880&m=dev) | 360×800 | Cell/UserItem×13 | ⬜ |


### W4. 타 유저 프로필 메인

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 프로필 첫 진입 | [`1:12770`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12770&m=dev) | 1200×872 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 웹 | 프로필_내용있음 | [`1:13409`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13409&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12 | ⬜ |
| 웹 | 프로필_폴더에 내용없음 | [`1:14367`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14367&m=dev) | 1200×1005 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Empty | ⬜ |
| 웹 | 프로필 첫 진입_글 | [`1:14568`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14568&m=dev) | 1200×764 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 웹 | 프로필_내용있음 | [`1:14509`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14509&m=dev) | 1200×720 | Cell/UserItem×10, Tab/Tab, Filter/Filter | ⬜ |
| 태블릿 | 프로필 첫 진입 | [`1:331961`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-331961&m=dev) | 768×1024 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 태블릿 | 프로필_내용있음 | [`1:332600`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332600&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12 | ⬜ |
| 태블릿 | 프로필_폴더에 내용없음 | [`1:333446`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333446&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Empty | ⬜ |
| 태블릿 | 프로필 첫 진입_글 | [`1:333645`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333645&m=dev) | 768×1024 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 태블릿 | 프로필_내용있음 | [`1:333587`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333587&m=dev) | 768×1024 | Cell/UserItem×9, Tab/Tab, Filter/Filter | ⬜ |
| 모바일 | 프로필 첫 진입 | [`1:235727`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-235727&m=dev) | 360×800 | Tab/Tab, Category/Category, Filter/Filter, Empty | ⬜ |
| 모바일 | 프로필_내용있음 | [`1:235852`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-235852&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12 | ⬜ |
| 모바일 | 프로필_내용있음 | [`1:236768`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236768&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Empty | ⬜ |
| 모바일 | 프로필 첫 진입_글 | [`1:237008`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237008&m=dev) | 360×800 | Tab/Tab, Filter/Filter, Empty | ⬜ |
| 모바일 | 프로필_내용있음 | [`1:236897`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236897&m=dev) | 360×800 | Cell/UserItem×10, Tab/Tab, Filter/Filter | ⬜ |


### W5. 타 유저 더보기 · 차단 상태

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 프로필_더보기 | [`1:13733`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13733&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 웹 | 프로필_차단당함 | [`1:13461`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13461&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 웹 | 프로필_더보기 | [`1:13513`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13513&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 웹 | 프로필_차단 함 | [`1:13565`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13565&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 웹 | 프로필_더보기 | [`1:13617`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13617&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 태블릿 | 프로필_더보기 | [`1:332924`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332924&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 태블릿 | 프로필_차단당함 | [`1:332652`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332652&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 태블릿 | 프로필_더보기 | [`1:332704`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332704&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 태블릿 | 프로필_차단 함 | [`1:332756`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332756&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 태블릿 | 프로필_더보기 | [`1:332808`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332808&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Menu | ⬜ |
| 모바일 | 프로필_더보기 | [`1:236004`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236004&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, BottomSheet, Cell/ListItem×4 | ⬜ |
| 모바일 | 프로필_더보기 | [`1:236085`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236085&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 모바일 | 프로필_더보기 | [`1:236229`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236229&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, BottomSheet, Cell/ListItem×3 | ⬜ |
| 모바일 | 프로필_더보기 | [`1:236157`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236157&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 모바일 | 프로필_더보기 | [`1:236308`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-236308&m=dev) | 360×800 | Cell/UserItem×3, Tab/Tab, Category/Category, Filter/Filter, Card/Album×12, BottomSheet, Cell/ListItem×3 | ⬜ |


### W6. 프로필 수정 모달

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 프로필 수정 | [`1:12916`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12916&m=dev) | 500×798 | Modal | ⬜ |
| 웹 | 링크 추가 시 | [`1:12937`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12937&m=dev) | 500×760 | Modal, Dropdown/Dropdown | ⬜ |
| 웹 | 프로필 수정_내용 입력 | [`1:12974`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12974&m=dev) | 500×1115 | Modal, Dropdown/Dropdown×4 | ⬜ |
| 웹 | 프로필 수정_순서 변경 | [`1:13011`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13011&m=dev) | 500×760 | Modal, Dropdown/Dropdown×4 | ⬜ |
| 웹 | 프로필 수정_순서 변경 | [`1:13048`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13048&m=dev) | 500×760 | Modal, Dropdown/Dropdown×4 | ⬜ |
| 웹 | 프로필 수정_순서 변경 | [`1:13087`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13087&m=dev) | 500×760 | Modal, Dropdown/Dropdown×4 | ⬜ |
| 웹 | 스크롤 발생 | [`1:13330`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13330&m=dev) | 500×760 | Modal, Dropdown/Dropdown | ⬜ |
| 웹 | 스크롤 발생 | [`1:13356`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13356&m=dev) | 500×760 | Modal, Dropdown/Dropdown | ⬜ |
| 웹 | 외부 링크 필터 | [`1:13382`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13382&m=dev) | 500×760 | Modal, Dropdown/Dropdown, Menu | ⬜ |
| 웹 | 프로필_프로필 수정 | [`1:13126`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13126&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Modal, Dropdown/Dropdown | ⬜ |
| 태블릿 | 프로필 수정 | [`1:332107`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332107&m=dev) | 500×798 | Modal | ⬜ |
| 태블릿 | 프로필 수정 | [`1:332128`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332128&m=dev) | 500×760 | Modal, Filter/Filter | ⬜ |
| 태블릿 | 프로필 수정_내용 입력 | [`1:332165`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332165&m=dev) | 500×1115 | Modal, Filter/Filter×4 | ⬜ |
| 태블릿 | 프로필 수정_순서 변경 | [`1:332202`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332202&m=dev) | 500×760 | Modal, Filter/Filter×4 | ⬜ |
| 태블릿 | 프로필 수정_순서 변경 | [`1:332239`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332239&m=dev) | 500×760 | Modal, Filter/Filter×4 | ⬜ |
| 태블릿 | 프로필 수정_순서 변경 | [`1:332278`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332278&m=dev) | 500×760 | Modal, Filter/Filter×4 | ⬜ |
| 태블릿 | 스크롤 발생 | [`1:332521`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332521&m=dev) | 500×760 | Modal, Filter/Filter | ⬜ |
| 태블릿 | 스크롤 발생 | [`1:332547`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332547&m=dev) | 500×760 | Modal, Filter/Filter | ⬜ |
| 태블릿 | 외부 링크 필터 | [`1:332573`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332573&m=dev) | 500×760 | Modal, Filter/Filter, Menu | ⬜ |
| 태블릿 | 프로필_프로필 수정 | [`1:332317`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332317&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter×2, Card/Album×12, Modal | ⬜ |
| 모바일 | 프로필 수정 | [`1:237114`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237114&m=dev) | 360×800 |  | ⬜ |
| 모바일 | 프로필 수정 | [`1:238293`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238293&m=dev) | 360×800 | Dropdown/Dropdown | ⬜ |
| 모바일 | 프로필 수정_내용 입력 | [`1:238337`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238337&m=dev) | 360×1073 | Dropdown/Dropdown×4 | ⬜ |
| 모바일 | 프로필 수정_순서 변경 | [`1:238564`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238564&m=dev) | 360×800 | Dropdown/Dropdown×4 | ⬜ |
| 모바일 | 프로필 수정_순서 변경 | [`1:238621`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238621&m=dev) | 360×800 | Dropdown/Dropdown×4 | ⬜ |
| 모바일 | 프로필 수정_순서 변경 | [`1:238680`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238680&m=dev) | 360×800 | Dropdown/Dropdown×4 | ⬜ |
| 모바일 | 프로필 수정_스크롤 | [`1:238394`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238394&m=dev) | 360×800 | Dropdown/Dropdown×4 | ⬜ |
| 모바일 | 프로필 수정_스크롤 | [`1:238507`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238507&m=dev) | 360×800 | Dropdown/Dropdown×4 | ⬜ |
| 모바일 | 외부 링크 필터 | [`1:238451`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238451&m=dev) | 360×800 | Dropdown/Dropdown, BottomSheet, Cell/ListItem×6 | ⬜ |
| 모바일 | 프로필 수정 | [`1:238196`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238196&m=dev) | 360×800 | BottomSheet | ⬜ |
| 모바일 | 프로필 수정 | [`1:238244`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238244&m=dev) | 360×800 | BottomSheet | ⬜ |


### W7. 커버 · 프로필 이미지 수정

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 프로필 커버 수정 | [`1:12961`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12961&m=dev) | 500×473 | Modal | ⬜ |
| 웹 | 프로필 이미지 수정 | [`1:12967`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-12967&m=dev) | 500×557 | Modal | ⬜ |
| 웹 | 프로필_이미지 수정 | [`1:13266`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13266&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 웹 | 프로필_프로필 수정 완료 | [`1:13209`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-13209&m=dev) | 1200×720 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |
| 태블릿 | 프로필 커버 수정 | [`1:332152`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332152&m=dev) | 500×473 | Modal | ⬜ |
| 태블릿 | 프로필 이미지 수정 | [`1:332158`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332158&m=dev) | 500×557 | Modal | ⬜ |
| 태블릿 | 프로필_이미지 수정 | [`1:332457`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332457&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Modal | ⬜ |
| 태블릿 | 프로필_프로필 수정 완료 | [`1:332400`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-332400&m=dev) | 768×1024 | Cell/UserItem×3, Tab/Tab, Filter/Filter, Card/Album×12, Toast | ⬜ |


### W8. 앨범 편집

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 앨범 편집_첫 진입 | [`1:14978`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14978&m=dev) | 1200×720 |  | ⬜ |
| 웹 | 앨범 편집_작성 | [`1:14996`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14996&m=dev) | 1200×720 |  | ⬜ |
| 웹 | 앨범 편집_첫 진입 | [`1:15110`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-15110&m=dev) | 1200×720 |  | ⬜ |
| 웹 | 앨범 편집_에러 | [`1:15192`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-15192&m=dev) | 1200×720 |  | ⬜ |
| 웹 | 앨범 편집_앨범 삭제 | [`1:15021`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-15021&m=dev) | 1200×720 | Alert | ⬜ |
| 웹 | 앨범 편집_앨범 삭제 | [`1:15084`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-15084&m=dev) | 1200×720 | Toast | ⬜ |
| 웹 | 앨범 편집_순서 편집 | [`1:15136`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-15136&m=dev) | 1200×720 |  | ⬜ |
| 웹 | 앨범 편집_순서 편집 | [`1:15164`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-15164&m=dev) | 1200×720 |  | ⬜ |
| 웹 | 앨범_앨범명 변경 | [`1:15049`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-15049&m=dev) | 1200×720 | Modal | ⬜ |
| 태블릿 | 앨범 편집_첫 진입 | [`1:334042`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334042&m=dev) | 768×1024 |  | ⬜ |
| 태블릿 | 앨범 편집_작성 | [`1:334060`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334060&m=dev) | 768×1024 |  | ⬜ |
| 태블릿 | 앨범 편집_앨범 8개 | [`1:334177`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334177&m=dev) | 768×1024 |  | ⬜ |
| 태블릿 | 앨범 편집_에러 | [`1:334259`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334259&m=dev) | 768×1024 |  | ⬜ |
| 태블릿 | 앨범 편집_앨범 삭제 | [`1:334088`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334088&m=dev) | 768×1024 | Alert | ⬜ |
| 태블릿 | 앨범 편집_앨범 삭제 | [`1:334151`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334151&m=dev) | 768×1024 | Toast | ⬜ |
| 태블릿 | 앨범 편집_순서 편집 | [`1:334203`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334203&m=dev) | 768×1024 |  | ⬜ |
| 태블릿 | 앨범 편집_순서 편집 | [`1:334231`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334231&m=dev) | 768×1024 |  | ⬜ |
| 태블릿 | 앨범_앨범명 변경 | [`1:334116`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-334116&m=dev) | 768×1024 | Modal | ⬜ |
| 모바일 | 앨범 편집_첫 진입 | [`1:237155`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237155&m=dev) | 360×800 |  | ⬜ |
| 모바일 | 앨범 편집_첫 진입 | [`1:237828`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237828&m=dev) | 360×800 |  | ⬜ |
| 모바일 | 앨범 편집_앨범 8개 | [`1:237951`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237951&m=dev) | 360×800 |  | ⬜ |
| 모바일 | 앨범 편집_앨범 8개 | [`1:238158`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238158&m=dev) | 360×800 |  | ⬜ |
| 모바일 | 앨범 편집_앨범 8개 | [`1:237990`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237990&m=dev) | 360×800 | Alert | ⬜ |
| 모바일 | 앨범 편집_앨범 8개 | [`1:238119`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238119&m=dev) | 360×800 | Toast | ⬜ |
| 모바일 | 앨범 편집_순서 편집 | [`1:237869`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237869&m=dev) | 360×800 |  | ⬜ |
| 모바일 | 앨범 편집_순서 편집 | [`1:237910`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237910&m=dev) | 360×800 |  | ⬜ |
| 모바일 | 앨범 편집_앨범 8개 | [`1:238031`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-238031&m=dev) | 360×800 | BottomSheet | ⬜ |


### W9. 그림 정리

| BP | 프레임 | node-id | 크기 | 주요 구성 | 상태 |
|---|---|---|---|---|---|
| 웹 | 그림 정리_첫 진입 | [`1:14637`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14637&m=dev) | 1200×720 | Empty | ⬜ |
| 웹 | 그림 정리_내용 있음 | [`1:14715`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14715&m=dev) | 1200×720 | Card/Album×20 | ⬜ |
| 웹 | 그림 정리_앨범명 변경 | [`1:14657`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14657&m=dev) | 1200×720 | Empty, Modal | ⬜ |
| 웹 | 그림 정리_앨범명 변경_입력 없음 | [`1:14686`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14686&m=dev) | 1200×720 | Empty, Modal | ⬜ |
| 웹 | 그림 정리_앨범 이동 | [`1:14755`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14755&m=dev) | 1200×720 | Card/Album×20 | ⬜ |
| 웹 | 그림 정리_앨범 이동 | [`1:14919`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14919&m=dev) | 1200×720 | Card/Album×20, Modal, Cell/ListItem×8 | ⬜ |
| 웹 | 그림 정리_그림 삭제 | [`1:14836`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14836&m=dev) | 1200×720 | Card/Album×20, Toast | ⬜ |
| 웹 | 그림 정리_그림 삭제 | [`1:14877`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14877&m=dev) | 1200×720 | Card/Album×20, Alert | ⬜ |
| 웹 | 그림 정리_그림 삭제 | [`1:14795`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-14795&m=dev) | 1200×720 | Card/Album×20, Toast | ⬜ |
| 태블릿 | 그림 정리_첫 진입 | [`1:333704`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333704&m=dev) | 768×1024 | Empty | ⬜ |
| 태블릿 | 그림 정리_내용 있음 | [`1:333782`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333782&m=dev) | 768×1024 | Card/Album×20 | ⬜ |
| 태블릿 | 그림 정리_앨범명 변경 | [`1:333724`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333724&m=dev) | 768×1024 | Empty, Modal | ⬜ |
| 태블릿 | 그림 정리_앨범명 변경_입력 없음 | [`1:333753`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333753&m=dev) | 768×1024 | Empty, Modal | ⬜ |
| 태블릿 | 그림 정리_앨범 이동 | [`1:333822`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333822&m=dev) | 768×1024 | Card/Album×20 | ⬜ |
| 태블릿 | 그림 정리_앨범 이동 | [`1:333986`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333986&m=dev) | 768×1024 | Card/Album×20, Modal, Cell/ListItem×8 | ⬜ |
| 태블릿 | 그림 정리_그림 삭제 | [`1:333903`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333903&m=dev) | 768×1024 | Card/Album×20, Toast | ⬜ |
| 태블릿 | 그림 정리_그림 삭제 | [`1:333944`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333944&m=dev) | 768×1024 | Card/Album×20, Alert | ⬜ |
| 태블릿 | 그림 정리_그림 삭제 | [`1:333862`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-333862&m=dev) | 768×1024 | Card/Album×20, Toast | ⬜ |
| 모바일 | 그림 정리_첫 진입 | [`1:237186`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237186&m=dev) | 360×800 | Empty | ⬜ |
| 모바일 | 그림 정리_내용 있음 | [`1:237392`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237392&m=dev) | 360×800 | Card/Album×20 | ⬜ |
| 모바일 | 그림 정리_앨범명 변경 | [`1:237222`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237222&m=dev) | 360×800 | Empty, BottomSheet | ⬜ |
| 모바일 | 그림 정리_앨범명 변경_입력 없음 | [`1:237307`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237307&m=dev) | 360×800 | Empty, BottomSheet | ⬜ |
| 모바일 | 그림 정리_앨범 이동 | [`1:237562`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237562&m=dev) | 360×800 | Card/Album×20 | ⬜ |
| 모바일 | 그림 정리_앨범 이동 | [`1:237676`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237676&m=dev) | 360×800 | Card/Album×20, BottomSheet, Cell/ListItem×8 | ⬜ |
| 모바일 | 그림 정리_앨범 이동 | [`1:237752`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237752&m=dev) | 360×800 | Card/Album×20, BottomSheet, Cell/ListItem×8 | ⬜ |
| 모바일 | 그림 정리_그림 이동 완료 | [`1:237448`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237448&m=dev) | 360×800 | Card/Album×20, Toast | ⬜ |
| 모바일 | 그림 정리_그림 삭제 | [`1:237618`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237618&m=dev) | 360×800 | Card/Album×20, Alert | ⬜ |
| 모바일 | 그림 정리_그림 삭제 완료 | [`1:237505`](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web?node-id=1-237505&m=dev) | 360×800 | Card/Album×20, Toast | ⬜ |


## 7. 검증 기준

- 단위마다 `npm run lint`와 타입체크 통과
- dev 서버에서 1440 / 768 / 360 폭으로 열어 Figma 스크린샷과 나란히 비교
- 기존 동작(팔로우 토글, 이미지 업로드, 무한 스크롤, 탭 전환, 정렬, 카테고리 필터, 앨범 CRUD, 그림 이동/삭제) 회귀 확인
