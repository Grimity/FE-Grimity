# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run storybook    # Start Storybook on port 6006
npm run build-storybook  # Build Storybook
```

## Architecture Overview

This is a **Next.js 15 Pages Router** application for Grimity (그리미티), an art/creative community platform.

### Tech Stack
- **Framework**: Next.js 15 with Pages Router (not App Router)
- **Language**: TypeScript 5 (strict mode)
- **State**: Zustand 5 for client state
- **Data Fetching**: TanStack React Query 5
- **HTTP**: Axios with interceptors
- **Styling**: SCSS Modules
- **Real-time**: Socket.io-client

### Directory Structure

```
src/
├── api/          # API functions organized by resource (feeds/, posts/, users/, chats/)
├── components/   # React components with co-located .module.scss and .types.ts
├── constants/    # App constants including axios instance (baseurl.tsx)
├── hooks/        # Custom React hooks (~26 hooks)
├── pages/        # Next.js pages (Pages Router)
├── queries/      # React Query mutation hooks
├── states/       # Zustand stores (auth, chat, device, modal, toast)
├── styles/       # Global and page-specific SCSS
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

### Key Patterns

**API Layer** (`src/api/`): Each resource has dedicated files following naming convention:
- `get{Resource}.ts` - GET requests with React Query hooks
- `post{Resource}.ts` - POST requests
- `put{Resource}.ts` - PUT requests
- `delete{Resource}.ts` - DELETE requests

**Zustand State** (`src/states/`): Access state outside React with `useAuthStore.getState()`

**Axios Instance** (`src/constants/baseurl.tsx`):
- Auto-attaches Bearer token from auth store
- Handles 401 with automatic token refresh
- Special headers: `exclude-access-token`, `is-delete-account`

**React Query Mutations** (`src/queries/`): Use optimistic updates pattern:
```typescript
onMutate: async () => { /* optimistic update */ },
onError: () => { /* rollback */ },
onSettled: () => { /* invalidate queries */ }
```

**Component Structure**: Each component folder contains:
- `Component.tsx` - Component logic
- `Component.module.scss` - Scoped styles
- `Component.types.ts` - TypeScript interfaces

**SCSS Token Usage**: Always import design tokens via `@use`, never use raw CSS variables directly:
```scss
// ✅ Correct
@use "@/styles/tokens/colors/semantic" as colors;
@use "@/styles/tokens/typography/semantic" as typo;
@use "@/styles/tokens/spacing" as spacing;
@use "@/styles/tokens/radius" as radius;

.element {
  background-color: colors.$surface-primary-normal;
  color: colors.$text-white;
  @include typo.label-5;
  padding: 0 spacing.$spacing-12;
}

// ❌ Wrong
.element {
  background-color: var(--surface-primary-normal);
}
```

### Shared Types

Types from backend are imported from `@grimity/dto` and `@grimity/shared-types` packages.

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_BASE_URL` - API base URL
- `NEXT_PUBLIC_IMAGE_URL` - Image CDN URL
- `NEXT_PUBLIC_SERVICE_URL` - Frontend service URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

### Path Alias

Use `@/*` to import from `src/`:
```typescript
import { useAuthStore } from "@/states/authStore";
```
