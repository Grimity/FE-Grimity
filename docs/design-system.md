# 디자인 시스템 컴포넌트 사용 규칙

Figma 링크와 함께 컴포넌트 구현 요청이 오면, **반드시 `src/components/common`의 디자인 시스템 컴포넌트를 먼저 확인하고 사용**해야 한다. 직접 HTML 태그나 커스텀 스타일로 구현하지 말 것.

## 작업 순서

1. Figma 디자인에서 사용된 UI 요소 파악
2. 아래 목록에서 대응하는 공통 컴포넌트 확인 — 없으면 해당 폴더의 `.tsx` 파일을 직접 읽어 props/사용법 파악
3. 공통 컴포넌트로 구현 가능한 부분은 반드시 공통 컴포넌트 사용
4. 공통 컴포넌트에 없는 경우에만 직접 구현

## 사용 가능한 공통 컴포넌트 (`src/components/common/`)

| 카테고리 | 컴포넌트 |
|---|---|
| **Icon** | `Icon` — `name`, `size` props |
| **Button** | `SolidButton`, `OutlinedButton`, `TextButton`, `IconButton` |
| **Input** | `TextField`, `TextArea`, `Input`, `MentionTextField`, `HelperText`, `Title` |
| **Avatar** | `Avatar`, `UserAvatar` |
| **Card** | `AlbumCard`, `ImgCard`, `UserCard`, `UserHoverCard` |
| **Cell** | `ControlItem`, `ListItem`, `UserInfo`, `UserItem` |
| **Chip** | `Chip` |
| **Control** | `Bookmark`, `CheckBox`, `CheckMark`, `Heart`, `RadioButton`, `Toggle` |
| **Divider** | `Divider` |
| **Empty** | `Empty` |
| **Filter** | `Filter` |
| **Loading** | `CircularLoading`, `RefreshDragging` |
| **Navigation** | `GNB`, `Menu`, `Sidebar` |
| **Pagination** | `Counter`, `Navigation` |
| **PopUp** | `Alert`, `BottomSheet`, `Modal`, `Toast` |
| **PushBadge** | `DotBadge`, `NumberBadge` |
| **SegmentedControl** | `Category`, `Tab` |
| **Tag** | `Tag`, `TagSelect` |
| **Thumbnail** | `Thumbnail` |
| **Dm** | `ChatBubble`, `DmInput`, `DmList` |
| **GroupSettings** | `GroupSettings` |
