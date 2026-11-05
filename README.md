# IDP English Test - Test Taker Portal MVP

**Projects:** MSP-2427 (Project Setup) + MSP-2011 (Component Library)  
**Status:** In Progress  
**Version:** 0.1.0

## Overview

This is the React-based frontend application for the IDP English Test (Moonshot) Test Taker Portal.

**Scope (Current Phase):**
- **MSP-2427** — React/Vite project initialization, configuration, and tooling setup
- **MSP-2011** — Shared component library and design token system

**Scope (Deferred):**
- Test Taker user flows (Account Creation, Onboarding, Buy Test, Results)
- Backend API integration
- Authentication flow (AWS Cognito)
- Routing and page implementation

**Team Note:** This repository is for the **Test Taker** experience only. The Institution/Receiving Office (RO) portal (`/ro/*` routes) is deferred to a future phase.

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **TypeScript** | 5.x | Type-safe development |
| **Vite** | 5.0.0 | Build tool, dev server, HMR |
| **Vitest** | 1.0.0 | Unit testing |
| **React Testing Library** | 14.1.0 | Component testing |
| **ESLint** | 8.54.0 | Code quality and linting |
| **Prettier** | 3.1.0 | Code formatting |
| **CSS Modules** | — | Component-scoped styles |

---

## Project Structure

```
iet-ui-testtaker-1/
├── src/
│   ├── components/          # React components
│   │   └── common/         # Shared, reusable components (MSP-2011)
│   │       ├── Alert/
│   │       ├── Button/
│   │       ├── Card/
│   │       ├── Dropdown/
│   │       ├── Input/
│   │       ├── MediaControls/
│   │       ├── Modal/
│   │       ├── Stepper/
│   │       ├── Timer/
│   │       ├── Toast/
│   │       └── Tooltip/
│   ├── hooks/              # Custom React hooks (placeholder)
│   ├── styles/             # Global styles and design tokens
│   │   ├── index.css       # Global styles entry point
│   │   ├── reset.css       # CSS reset
│   │   └── variables.css   # Design tokens (Layer 1: brand, Layer 2: semantic)
│   └── types/              # TypeScript declarations
├── tests/
│   └── setup.ts            # Vitest setup file
├── dist/                   # Production build output
├── package.json
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node/Config TypeScript configuration
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .env.example            # Environment variables template
├── .env.development        # Development environment
├── .env.production         # Production environment
└── index.html              # HTML entry point
```

### Folder Responsibilities

| Folder | Responsibility |
|--------|----------------|
| `src/components/common/` | Reusable UI components following IDP styling conventions |
| `src/hooks/` | Custom React hooks (to be populated as features are built) |
| `src/styles/` | Global styles, CSS reset, and design tokens (MSP-2011) |
| `src/types/` | TypeScript type declarations |
| `tests/` | Test setup configuration |

**Planned Folders (Not Implemented):**
- `src/pages/` — Page-level components (to be created when implementing user flows)
- `src/services/` — API client, business logic, and mock handlers
- `src/utils/` — Utility functions
- `src/config/` — Application configuration and constants
- `src/assets/` — Images, fonts, static assets

---

## MSP-2427 — React Project Setup

### Project Initialization

- React 18.2.0 with Vite 5.0.0
- TypeScript configured with `strict: true`
- Path aliases configured for clean imports:
  - `@components` → `src/components`
  - `@hooks` → `src/hooks`
  - `@styles` → `src/styles`
- Dev server runs on port 5173

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (`tsc && vite build`) |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript compiler without emitting files |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if files are formatted |

### Test Scripts

| Command | Description |
|---------|-------------|
| `npm run test` | Run tests with Vitest in watch mode |
| `npm run test:run` | Run tests once (CI-friendly) |
| `npm run test:ui` | Run tests with Vitest UI dashboard |
| `npm run test:coverage` | Run tests and generate coverage report |

### Configuration

- **Vite:** `vite.config.ts` — alias configuration, dev server settings, build options
- **TypeScript:** `tsconfig.json` — strict mode, path aliases, JSX settings
- **Vitest:** `vitest.config.ts` — globals enabled, JSdom environment, coverage config

---

## MSP-2011 — Component & Token Library

### Shared Component Architecture

**Design Principles:**
- **Reusability** — Components are generic and composable
- **Accessibility** — WCAG 2.1 AA compliant (labels, roles, keyboard navigation, focus management)
- **Testability** — Each component has co-located tests
- **Maintainability** — Clear APIs, documented props, single responsibility

**Component Location:** All components reside in `src/components/common/`

### Implemented Components

| Component | Files | Purpose |
|-----------|-------|---------|
| **Alert** | Alert.tsx, Alert.module.css, Alert.test.tsx | In-page feedback messages with variants (info, success, warning, error) |
| **Button** | Button.tsx, Button.module.css, Button.test.tsx | Reusable button with variants and loading state |
| **Card** | Card.tsx, Card.module.css, Card.test.tsx | Structural container for grouped content |
| **Dropdown** | Dropdown.tsx, Dropdown.module.css, Dropdown.test.tsx | Styled native `<select>` with accessibility |
| **Input** | Input.tsx, Input.module.css, Input.test.tsx | Form input with label, error, and helper text |
| **MediaControls** | MediaControls.tsx, MediaControls.module.css, MediaControls.test.tsx | Audio/video playback controls (play, pause, progress, volume) |
| **Modal** | Modal.tsx, Modal.module.css, Modal.test.tsx | Accessible dialog with focus trap and scroll lock |
| **Stepper** | Stepper.tsx, Stepper.module.css, Stepper.test.tsx | Multi-step progress indicator |
| **Timer** | Timer.tsx, Timer.module.css, Timer.test.tsx | Countdown timer with warning states |
| **Toast** | ToastProvider.tsx, Toast.module.css, Toast.test.tsx, index.ts | Context-based toast notifications with aria-live regions |
| **Tooltip** | Tooltip.tsx, Tooltip.module.css, Tooltip.test.tsx | Accessible tooltip on hover, focus, and touch |

**Barrel Exports:** All components are exported via `src/components/common/index.ts`

### CSS Modules Convention

- Component styles are defined in `*.module.css` files
- Styles are imported as a `styles` object and applied using class name composition
- Example:
  ```tsx
  import styles from './Button.module.css';
  
  const buttonClass = [
    styles.btn,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');
  ```

### Design Tokens

**Two-Layer Architecture:**

**Layer 1 — Brand Palette** (Raw, swappable)
- Located in `src/styles/variables.css`
- Variables prefixed with `--brand-*`
- Examples: `--brand-primary`, `--brand-secondary`, `--brand-accent`
- **To re-brand, override ONLY these values**

**Layer 2 — Semantic Tokens** (Components reference these only)
- Located in `src/styles/variables.css`
- Variables prefixed with `--color-*`
- Examples: `--color-action`, `--color-danger-action`, `--color-surface`
- Components reference ONLY these semantic tokens

**Example:**
```css
/* Layer 1 (brand) */
:root {
  --brand-primary: #FF6A00;
  --brand-primary-rgb: 255, 106, 0;
}

/* Layer 2 (semantic) */
:root {
  --color-action: var(--brand-primary);
  --color-focus-ring-faint: rgba(var(--brand-primary-rgb), 0.1);
}
```

### Component Styling Standards

- **No hardcoded hex values** — All colors use CSS variables from design tokens
- **SVG icons only** — No emoji or icon fonts
- **CSS custom properties** — Use design tokens for spacing, typography, shadows, transitions
- **Responsive design** — Media queries reference breakpoint tokens from `variables.css`

### Component Testing Conventions

- **Co-located tests** — `ComponentName.test.tsx` in same folder
- **Testing Library** — `render`, `screen`, `fireEvent` for DOM interaction
- **Vitest** — `describe`, `it`, `expect` for test structure
- **Mocking** — `vi.fn()` for event handlers, timers, etc.

### Accessibility Requirements (WCAG 2.1 AA)

Every component must implement:
- Proper semantic roles (`role="alert"`, `role="dialog"`, `role="slider"`, etc.)
- `aria-*` attributes for dynamic state (`aria-label`, `aria-describedby`, `aria-current`, etc.)
- Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- Visible focus indicators (`:focus-visible` styles)
- Screen reader support (`aria-live` regions for dynamic content)

---

## Development Guidelines

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `Button.tsx`, `Alert.test.tsx` |
| Hook files | `use` + PascalCase | `useAuth.ts` (not yet implemented) |
| Component folders | PascalCase | `src/components/common/Button/` |
| Style files | PascalCase + `.module.css` | `Button.module.css` |
| Test files | PascalCase + `.test.tsx` | `Button.test.tsx` |
| CSS classes | BEM within module | `.btn`, `.btn--primary`, `.btn__spinner` |
| Variables/Functions | camelCase | `isLoading`, `handleSubmit` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` (not yet used) |
| Types/Interfaces | PascalCase | `ButtonProps`, `ApiResponse` |

### Component Creation Standards

1. **Co-locate** component, styles, and tests in same folder
2. **Export** component and default from `index.ts` in folder
3. **Document** props with JSDoc and TypeScript interfaces
4. **Style** using CSS Modules and design tokens only
5. **Test** with React Testing Library and Vitest
6. **Accessibility** — implement WCAG 2.1 AA requirements

### Styling Conventions

- Use CSS Modules for component styles
- Reference design tokens in `src/styles/variables.css`
- Do not use external CSS libraries (no Tailwind, Bootstrap, MUI)
- Use SVG for icons
- Prefer semantic class names over utility classes

### Testing Conventions

- **Unit tests** for all components
- **Co-located** with source files
- **Mock** external dependencies with `vi.fn()`
- **Verify** accessibility attributes where applicable

---

## Development Setup

### Prerequisites

- Node.js (current Active LTS)
- npm or compatible package manager

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output is written to `dist/`

---

## Environment Configuration

Environment variables use `VITE_*` prefix (Vite convention).

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_APP_NAME` | Application name |
| `VITE_APP_VERSION` | Application version |
| `VITE_ENABLE_MOCK_SERVER` | Enable/disable mock server (not yet implemented) |
| `VITE_ENABLE_ANALYTICS` | Enable/disable analytics |

---

## Git Workflow

- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-description`
- Merge to main: Create merge request for review

---

## Current Status

**Completed:**
- ✅ MSP-2427 — React/Vite project setup and configuration
- ✅ MSP-2011 — 11 shared components with tests
- ✅ Design token system with two-layer architecture
- ✅ ESLint and Prettier configuration
- ✅ Vitest and React Testing Library setup

**In Progress:**
- 🚧 Test Taker user flow implementation
- 🚧 Backend API integration
- 🚧 Authentication flow

**Deferred:**
- ⏭️ Test Taker pages and routes
- ⏭️ Institution/RO portal
- ⏭️ Mock server implementation (MSW)

---

## Documentation

- Component usage: See `src/components/common/README.md`
- Design tokens: See `src/styles/variables.css`
- IDP React standards: See `react-nextjs-standards.md`

---

## License

Proprietary — IDP Group