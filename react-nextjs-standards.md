---
name: react-nextjs-standards
description: Generic conventions for building React and Next.js projects — version policy, App Router structure, styling, naming, coding, TypeScript, monorepo choices, and testing. Use when creating or editing any React/Next.js code.
inclusion: auto
---

# React & Next.js Standards

Project-agnostic standards for all React/Next.js work. These apply to **new projects** and to any existing project unless that repo documents its own override. Where a concrete example helps, the in-house `he-websites` monorepo is cited as a reference — treat it as one valid setup, not the required one.

## Version policy

**New projects: use the latest stable release of every tool.** Do not start a greenfield project on an old major version. Pin exact versions in `package.json` at project creation, then upgrade deliberately.

- Pick the latest **stable** (not canary/beta/RC) release at project start.
- Match the Node version to an active LTS line that your deploy target (Lambda, container, Vercel, etc.) actually supports.
- Prefer the framework's **Active LTS** for production traffic; avoid canary in production.
- Record the chosen versions in the repo (README or an `.nvmrc` / `engines` field) so the team shares one baseline.

**Reference — latest stable as of October 2026** (verify current values at project start; these move):

| Tool         | Latest stable (Oct 2026)     | Notes                                                 |
| ------------ | ---------------------------- | ----------------------------------------------------- |
| Next.js      | `16.4` (Active LTS `16.3.x`) | App Router is the default                             |
| React        | `19.x`                       | Server Components stable                              |
| TypeScript   | `5.x`                        | Always `strict: true`                                 |
| Tailwind CSS | `v4.x`                       | v4 uses CSS-first config; v3 uses `tailwind.config.*` |
| Node.js      | current Active LTS           | Must match the runtime your host offers               |

**Existing projects: match the repo, don't silently upgrade.** When editing an existing project, use the versions and patterns already in `package.json`. Example: `he-websites` currently runs Next.js 15.5 / React 19 / Tailwind 3.4 — new code there follows 15.x + Tailwind v3 conventions. Propose an upgrade as a separate, deliberate task; never mix major-version patterns in one PR.

## Router: App Router by default

Use the **App Router** (`src/app/`) for all new projects. The Pages Router is legacy — only use it when working inside a repo that is already committed to it, and don't add new `pages/` routes to an App-Router project.

**File conventions:**

- `page.tsx` — route UI
- `layout.tsx` — shared shell (root layout wraps `<html>`/`<body>`)
- `loading.tsx` — suspense fallback
- `error.tsx` / `global-error.tsx` — error boundaries
- `not-found.tsx` — 404 UI
- `route.ts` — API route handlers (under `app/api/`)
- `middleware.ts` — edge middleware at `src/middleware.ts`

**Route groups** `(name)/` organize routes by domain without affecting the URL:

```
src/app/
  (marketing)/
  (dashboard)/
  (auth)/
  api/
  layout.tsx
  globals.css
  not-found.tsx
```

### Server vs Client Components

- Components are **Server Components by default** — keep them server-side when they only fetch/render.
- Add `"use client"` only when the component needs hooks, browser APIs, or event handlers. Push it to the leaf — don't mark a whole page client for one interactive child.
- Fetch data in Server Components or route handlers, not in client `useEffect`, where possible.

## Styling: Tailwind CSS with design tokens

**Default styling approach → Tailwind CSS, utility-first, with a centralized design-token theme.** One styling system per project. Avoid mixing Tailwind with CSS Modules / styled-components / SCSS unless a repo already does so.

Rules:

- Drive all colors, spacing, font sizes, breakpoints, shadows from the project's design tokens — reference token classes (`text-heading-lg`, `bg-primary-500`, `md:`, `lg:`), not raw hex in markup.
  - **Tailwind v4:** define tokens in CSS with `@theme` (CSS-first config).
  - **Tailwind v3:** define tokens in `theme` / `theme.extend` in `tailwind.config.*`.
- Reserve arbitrary values (`w-[205px]`) for genuine one-offs; promote anything reused into a token.
- Keep global/base styles in a single `globals.css`. Avoid per-component `.css`/`.scss` files.
- When class names are composed dynamically (string concat), ensure they survive purge (Tailwind v3: add to `safelist`; v4: keep them statically analyzable).
- Use the project's named breakpoints rather than hardcoded media queries.
- Alternatives (CSS Modules, vanilla-extract) are acceptable only when a project has a documented reason; state it in that repo's README.

## Naming standards

Follow these naming conventions to keep your codebase consistent and predictable.

### Files and Folders

- **Component files:** `PascalCase.tsx` (e.g. `UserProfile.tsx`, `Header.tsx`)
- **Hook files:** `usePascalCase.ts` (e.g. `useUserProfile.ts`, `useFormValidation.ts`)
- **Utility files:** `camelCase.ts` (e.g. `formatDate.ts`, `validateEmail.ts`)
- **Test files:** `*.test.tsx` / `*.test.ts` co-located with source (e.g. `UserProfile.test.tsx`)
- **Folder names:** `kebab-case` (e.g. `user-profile`, `header-bar`, `form-validation`)

### Variables, Functions, Types

- **Variables and functions:** `camelCase` (e.g. `userName`, `fetchUserData`, `handleSubmit`)
- **Constants:** `SCREAMING_SNAKE_CASE` (e.g. `MAX_RETRIES`, `API_TIMEOUT`)
- **Types, Interfaces, Enums:** `PascalCase` (e.g. `User`, `ProductProps`, `ResponseStatus`)
- **Generics:** `PascalCase` with `T` prefix (e.g. `TProps`, `TResponse`, `TError`)

### Route segments and URLs

- Use `kebab-case` in route folder names for readable URLs (e.g. `src/app/(marketing)/about-us/page.tsx` → `/about-us`)
- Avoid underscores or spaces in route segments.

## Coding standards

### General

- Write **pure, testable functions** where possible — minimize side effects.
- Prefer **immutable updates** — return new objects/arrays instead of mutating existing ones.
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`) for safe property access.
- Keep functions **small and focused** — follow the Single Responsibility Principle.
- Avoid deeply nested conditionals — extract logic into named functions when possible.

### React

- **Props interfaces** should be explicit (no implicit `any`).
- **Default props** go in the component signature (function parameters), not `Component.defaultProps`.
- **Key props** on lists should be stable, unique, and predictable (prefer IDs over array indices).
- **Event handlers** should be memoized with `useCallback` when passed to optimized children or used in `useEffect` deps.
- **Derived state** should be computed in render, not stored in `useState` (or use `useMemo`).

### TypeScript

- **No implicit `any`** — enable `noImplicitAny` and fix all warnings.
- **Explicit return types** on public functions and class methods.
- **Avoid `any`** — use `unknown` when the type is genuinely unknown, or generics when possible.
- **Namespace modules** (e.g. `const { format, parse } = dateFns`) instead of `import * as`.
- **Prefer interfaces over type aliases** for object shapes; use type aliases for unions, primitives, and complex generics.

### Imports

- Order imports: `std-lib → external → internal → relative`
- Use path aliases (`@/*`, `@lib/*`, `@components/*`) to avoid deep relative paths.
- Remove unused imports; group with `eslint-plugin-import`.

## TypeScript

- Always `strict: true`. Enable `noUnusedLocals` + `noUnusedParameters`. Treat `any` as a defect; type props and API responses explicitly.
- Use path aliases instead of deep relative imports (configure in `tsconfig.json`), e.g. `@/*`, `@components/*`, `@lib/*`. In a monorepo, alias shared packages (`@packages/*`).
- Keep shared domain types and constants in a shared location (a `types`/`models` module, or a shared package in a monorepo).

## Monorepo: choose by use case

**Single app → a plain Next.js project.** Don't add monorepo tooling you don't need.

**Multiple apps / shared code → a monorepo** (Turborepo or Nx with npm/pnpm workspaces). Use one when:

- Two or more deployable apps share components, hooks, utilities, or types.
- You want shared lint/test/build config and coordinated versioning.

Reference monorepo layout (as in `he-websites`, Turborepo + npm workspaces):

```
apps/<app>/
  src/
    app/            # App Router routes (route groups by domain)
    components/     # app-specific components
    lib/            # app-specific utilities
    middleware.ts
  public/
  <infra>/          # per-app infra (e.g. CDK, serverless)
packages/
  shared-components/  # cross-app React components, grouped by feature
  shared-pages/
  hooks/              # reusable React hooks
  lib/                # shared utilities
  models/             # shared TS types/interfaces
  constants/
  configs/            # shared lint/ts/tailwind config
```

Rules:

- Code used by more than one app belongs in `packages/*`, never duplicated per app.
- Group shared components by feature/domain (`course-details/`, `institution-profile/`), not by generic type.
- Keep app-specific one-offs in `apps/<app>/src/components`.

## Component conventions

- One component per file; name the file after the component.
- Co-locate the component's test (`*.test.tsx`) next to it, or under a package test folder.
- Prefer composition and small components; lift shared UI into the shared-components layer.
- Use `next/image` for images and `next/link` for internal navigation.
- Wrap risky client subtrees in an error boundary.

## Data fetching & API

- API route handlers live under `src/app/api/.../route.ts`.
- Validate inputs in the handler before forwarding to any downstream service.
- Set an explicit timeout on downstream HTTP calls.
- Propagate a correlation id header (e.g. `x-correlation-id`) on outbound requests for tracing.
- Never hardcode secrets or API keys in source — use env vars / a secrets store (see security-policy steering).

## Testing standards

**New projects: use Vitest + React Testing Library.** Vitest is fast, Vite-native, and works out of the box with Next.js 13+.

**Existing projects: use the runner already configured.** If a repo uses Jest, keep it — don't migrate just for consistency.

### Test structure

- **Location:** Co-locate `*.test.tsx` / `*.test.ts` next to source files (e.g. `UserProfile.tsx` → `UserProfile.test.tsx`).
- **File naming:** Use the source file name with `.test` suffix and matching extension.
- **Folder structure:** For large components, group tests in a `__tests__/` folder, but prefer co-location when possible.

### Test guidelines

- **Unit tests** focus on small, isolated units (a function, hook, or simple component).
- **Integration tests** verify multi-step workflows (form submission, navigation, API calls).
- **E2E tests** (optional) verify critical user journeys across the full app (use Playwright or Cypress if needed).
- Mock external dependencies (APIs, context providers) with `vi.fn()` (Vitest) or `jest.fn()` (Jest).
- Aim for **high coverage on utilities/hooks**, **moderate coverage on presentational components**.

### Test runners

- **Vitest:** `npm test`, `npm run test:coverage`. Supports `vi.mock()`, `vi.fn()`, and React Testing Library.
- **Jest:** `npm test`, `npm run test:coverage`. Use `jest.mock()`, `jest.fn()`.

### Snapshot tests

- Use sparingly — prefer asserting on specific behavior over snapshotting full HTML.
- Update snapshots only when the UI change is intentional.

## Tooling

- **Lint:** ESLint with the framework's recommended config (`next/core-web-vitals` + `next/typescript`). Run before commit.
- **Format:** Prettier.
- **Test:** Vitest for new projects; Jest where already configured. Both work with React Testing Library.
- Fix lint/type issues rather than disabling checks in `next.config` for new code.

## Do / Don't

- ✅ New projects on latest stable; App Router; Server Components by default; Tailwind with design tokens; TypeScript strict; shared code in `packages/*`; monorepo only when multiple apps share code; Vitest for new test suites.
- ❌ Starting new projects on old majors; Pages Router for new routes; mixing styling systems without reason; raw hex in JSX; `any` types; deep relative imports; secrets in source; monorepo tooling for a single app; snapshot tests for every component.
