# IDP English Test — Moonshot Test Taker Portal Frontend

**Application:** Test Taker SPA for IDP English Test (Moonshot)
**Repository:** `https://gitlab.com/idp-education/idp-english-test/ui/iet-ui-testtaker`
**Version:** 0.1.0 (MVP)
**Status:** Active Development

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture & Design](#architecture--design)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [Authentication Flow](#authentication-flow)
7. [Component Library (MSP-2011)](#msp-2011--component-library)
8. [Development Setup](#development-setup)
9. [Development Scripts](#development-scripts)
10. [Environment Configuration](#environment-configuration)
11. [Code Standards & Conventions](#code-standards--conventions)
12. [Testing & Quality](#testing--quality)
13. [Contributing](#contributing)
14. [Current Status & Roadmap](#current-status--roadmap)
15. [Support & Documentation](#support--documentation)

---

## Overview

This is the **React + Vite single-page application (SPA)** for the **Test Taker-facing** IDP English Test (Moonshot) platform. It handles the complete Test Taker experience: account creation, onboarding, profile completion, test purchase, and results retrieval.

### Scope — Test Taker Only

This repository implements the **Test Taker experience ONLY**. The Institution and Receiving Office (RO) portal (`/ro/*` routes) is deferred to a future phase.

### Key Responsibilities

- **Account Creation** — Email + password sign-up with validation
- **Onboarding & Profiling** — Nationality, language background, identity verification
- **Buy a Test** — On-demand purchase with transparent pricing (Stripe integration)
- **Results Portal** — Official results within 48h, downloadable PDF, Appeal flow
- **User Dashboard** — Profile, enrolments, test history, results overview

### Source of Truth (Confluence)

- **PRD 2.1** — Account Creation, Onboarding & Profiling
- **PRD 2.2** — Buy a Test
- **PRD 2.3** — Results & Insights (Results Portal)
- **SD: MVP — Test Taker Experience** — Architecture, API contracts
- **SD: MVP — Result Management** — Results, Assessment ID generation

---

## Architecture & Design

### Application Architecture

```
┌─────────────────────────────────────┐
│      React SPA (Client-Side)        │
├─────────────────────────────────────┤
│  Pages (Signup, Login, Dashboard)   │
│  Components (Forms, Cards, Modals)  │
│  Hooks (useAuth, useApi, etc.)      │
│  Services (API client, Auth logic)  │
└────────┬────────────────────────────┘
         │ HTTP/REST
┌────────▼────────────────────────────┐
│  Backend — Enrolment Service        │
│  AWS API Gateway + Lambda           │
│  Base: /test-takers/v1/me           │
│  Auth: OAuth2 (Cognito Hosted UI)   │
└─────────────────────────────────────┘
```

### Authentication Flow

**OAuth2 Authorization Code Grant** via AWS Cognito Hosted UI:

1. **User clicks "Sign In"** → Redirected to Cognito Hosted UI
2. **Cognito authenticates** → Returns authorization code
3. **Exchange code** → Access token + ID token (signed JWT)
4. **Redirect to callback** → `/auth/callback?code=...`
5. **Store tokens** → localStorage (or secure session)
6. **Route to Dashboard** → Authenticated user experience

**Note:** Direct SDK sign-in (`signIn()` with USER_SRP_AUTH) is NOT used; Cognito Hosted UI is the primary auth method.

### Key Design Decisions

| Decision | Rationale | Reference |
|----------|-----------|-----------|
| **Cognito Hosted UI** | Secure, PCI-compliant, IDP-owned | TD: MVP — Test Taker Experience |
| **Assessment ID Format** | `IDP-ENG-XXXX-XXXX` (cryptographically random) | SD: MVP — Result Management |
| **Stripe Embedded Checkout** | CC/debit only for MVP, transparent pricing | PRD 2.2 — Buy a Test |
| **CSS Modules (no external UI libs)** | Custom styling per IDP brand guidelines | Project Conventions |
| **WCAG 2.1 AA Accessibility** | Hard requirement for all components | Project Conventions |

---

## Technology Stack

| Category | Tool | Version | Purpose |
|----------|------|---------|---------|
| **Framework** | React | 18.2.0 | UI rendering, component lifecycle |
| **Language** | TypeScript | 5.4.0 | Type safety, IDE support |
| **Build Tool** | Vite | 5.0.0 | Fast bundling, HMR, production optimization |
| **Routing** | React Router | 6.22.0 | Client-side navigation, nested routes |
| **Auth** | AWS Amplify | 6.22.2 | OAuth2 integration, Cognito support |
| **Styling** | CSS Modules | — | Scoped, maintainable component styles |
| **Testing** | Vitest | 1.0.0 | Unit tests, integration tests, fast runner |
| **Test Utils** | React Testing Library | 14.1.0 | DOM-centric component testing |
| **Linting** | ESLint | 8.54.0 | Code quality, consistency |
| **Formatting** | Prettier | 3.1.0 | Automatic code formatting |
| **CSS** | Tailwind CSS | 4.3.5+ | Design tokens, utility classes (future) |

### Why These Choices?

- **Vite over Webpack:** Faster dev server, instant HMR, smaller bundle size
- **TypeScript:** Type safety, refactoring confidence, IDE autocompletion
- **CSS Modules over Tailwind:** Custom IDP branding, no external CSS library required
- **Vitest over Jest:** Same API as Jest but 5-10x faster, Vue/Vite optimized
- **Amplify v6:** Direct Cognito integration, automatic token refresh

---

## Project Structure

```
iet-ui-testtaker-1/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Root component, routing entry point
│   │   ├── App.css                 # Global app styles
│   │   └── App.test.tsx            # App component tests
│   ├── components/
│   │   ├── auth/                   # Authentication pages & flows
│   │   │   ├── SignIn/
│   │   │   │   ├── SignIn.tsx
│   │   │   │   ├── SignIn.module.css
│   │   │   │   ├── SignIn.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── SignUp/
│   │   │   ├── ConfirmSignUp/      # Email verification
│   │   │   ├── SignOut/
│   │   │   ├── PasswordReset/      # Password recovery flow
│   │   │   └── index.ts            # Barrel export
│   │   ├── callback/               # Cognito callback handler
│   │   │   ├── Callback.tsx        # Processes auth code, redirects
│   │   │   ├── Callback.test.tsx
│   │   │   └── index.ts
│   │   ├── common/                 # Shared reusable components (MSP-2011)
│   │   │   ├── Alert/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Dropdown/
│   │   │   ├── Input/
│   │   │   ├── MediaControls/
│   │   │   ├── Modal/
│   │   │   ├── Stepper/
│   │   │   ├── Timer/
│   │   │   ├── Toast/
│   │   │   ├── Tooltip/
│   │   │   └── index.ts            # Barrel export for all common components
│   │   ├── dashboard/              # Test Taker dashboard
│   │   │   ├── Dashboard.tsx       # Main dashboard layout
│   │   │   ├── Dashboard.module.css
│   │   │   ├── Dashboard.test.tsx
│   │   │   └── index.ts
│   │   └── pages/                  # Page-level components (future)
│   │       ├── ResultsPage.tsx
│   │       ├── OnboardingPage.tsx
│   │       └── ...
│   ├── config/
│   │   ├── amplifyConfig.ts        # AWS Amplify configuration
│   │   └── env.ts                  # Typed environment variables
│   ├── hooks/
│   │   ├── useAuth.tsx             # Authentication context & hook
│   │   ├── useAuth.test.tsx
│   │   ├── useApi.ts               # API client hook (future)
│   │   └── ...
│   ├── layouts/
│   │   ├── AuthLayout.tsx          # Layout for auth pages (left panel + form)
│   │   ├── AuthLayout.module.css
│   │   ├── DashboardLayout.tsx     # Layout for authenticated pages (header + sidebar)
│   │   └── DashboardLayout.module.css
│   ├── pages/                      # Route-level page components
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── ...
│   ├── routes/
│   │   ├── AppRoutes.tsx           # Route definitions and protection
│   │   ├── ProtectedRoute.tsx      # Route guard component
│   │   └── types.ts                # Route types
│   ├── services/
│   │   ├── apiClient.ts            # Axios instance, interceptors
│   │   ├── authService.ts          # Auth-related API calls
│   │   ├── enrolmentService.ts     # Enrolment API calls
│   │   ├── paymentService.ts       # Payment (Stripe) API calls
│   │   └── ...
│   ├── styles/
│   │   ├── index.css               # Global styles entry point
│   │   ├── reset.css               # CSS reset (Normalize.css inspired)
│   │   ├── variables.css           # Design tokens (Layer 1: brand, Layer 2: semantic)
│   │   └── autofill.css            # Browser autofill input styling
│   ├── types/
│   │   ├── api.ts                  # API response types
│   │   ├── auth.ts                 # Authentication types
│   │   ├── enrolment.ts            # Enrolment domain types
│   │   └── index.ts                # Barrel export
│   ├── utils/
│   │   ├── validation.ts           # Form validation helpers
│   │   ├── formatting.ts           # String/number formatting
│   │   ├── errors.ts               # Error handling utilities
│   │   └── ...
│   ├── main.tsx                    # React DOM entry point
│   └── vite-env.d.ts               # Vite type definitions
├── tests/
│   ├── setup.ts                    # Vitest setup, global test utilities
│   ├── mocks/                      # Mock servers, handlers
│   │   ├── handlers.ts             # MSW request handlers
│   │   └── server.ts               # Mock server setup
│   └── ...
├── public/
│   ├── assets/                     # Static images, fonts (if not in src/assets)
│   └── ...
├── dist/                           # Production build output (gitignored)
├── node_modules/                   # Dependencies (gitignored)
├── .git/                           # Git repository
├── .env.example                    # Environment template (public)
├── .env.development                # Development secrets (gitignored)
├── .env.production                 # Production secrets (gitignored)
├── .env.test-integration           # Integration test secrets (gitignored)
├── .env.test-integration.example   # Integration test template (public)
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── .gitignore                      # Git ignore rules
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── package-lock.json               # Locked dependency versions
├── postcss.config.js               # PostCSS configuration (Tailwind)
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript for Node config files
├── vite.config.ts                  # Vite bundler configuration
├── vitest.config.ts                # Vitest test runner configuration
├── vitest.config.integration.ts    # Integration test configuration
├── README.md                       # This file
└── react-nextjs-standards.md       # IDP React coding standards
```

### Folder Responsibilities

| Folder | Responsibility | Imports |
|--------|----------------|---------|
| `src/components/` | React components (UI building blocks) | Imported from `@components` |
| `src/components/auth/` | Authentication pages (SignIn, SignUp, etc.) | Used in routes |
| `src/components/common/` | Reusable components (Button, Input, etc.) | Used throughout app |
| `src/config/` | Application configuration | Imported at startup |
| `src/hooks/` | Custom React hooks | Imported into components |
| `src/layouts/` | Layout wrapper components | Used in route definitions |
| `src/pages/` | Page-level route components | Used in routing |
| `src/routes/` | Route definitions & protection | Used in App.tsx |
| `src/services/` | API clients, business logic | Imported into hooks/components |
| `src/styles/` | Global styles, design tokens | Imported at index.css |
| `src/types/` | TypeScript type definitions | Imported throughout |
| `src/utils/` | Utility functions | Imported as needed |
| `tests/` | Test setup, mocks, test utilities | Used by all `.test.tsx` files |

---

## Core Features

### 1. Account Creation (Phase 1)

- **Sign Up Flow:**
  - Email + password registration
  - 12-character password policy: 1 upper, 1 lower, 1 number
  - Inline validation with real-time feedback
  - Non-enumerating duplicate-email error handling
  - Explicit consent capture (version + timestamp)

- **Email Verification:**
  - One-time link sent to user email
  - Expiring tokens (typically 24h)
  - Rate-limited resend option
  - Fallback: Resend button with cooldown

- **Under-18 Workflow:**
  - Parent/Guardian consent required
  - Contact information collection
  - Consent document digital signature

### 2. Onboarding & Profiling (Phase 1, Optional)

- **Profile Information:**
  - Nationality
  - Country of residence
  - First language
  - Years of English study
  - Target country
  - Reason for taking test

- **Identity Verification:**
  - Selfie upload + document verification
  - Passport or national ID required
  - Anti-spoofing checks

### 3. Buy a Test (Phase 2)

- **On-Demand Purchase:**
  - No booking required
  - No live proctoring
  - 21-day completion window from purchase
  - Transparent, fixed pricing

- **Payment Integration:**
  - Stripe Embedded Checkout
  - Credit card / debit card only (MVP)
  - Payment status tracking (PENDING → COMPLETED / FAILED / EXPIRED)
  - Receipt email + on-screen confirmation

### 4. Results & Insights (Phase 3)

- **Result Status:**
  - Official results within 48h of test completion
  - Status: PUBLISHED / CANCELLED

- **Results Portal:**
  - Assessment Results widget on dashboard
  - Detailed results view with per-skill breakdown
  - Assessment ID format: `IDP-ENG-XXXX-XXXX` (cryptographically random, stable)
  - Downloadable branded PDF
  - Copyable Assessment ID

- **Appeal & Review:**
  - Score Review request process
  - Malpractice appeal flow
  - Support contact information

---

## Authentication Flow

### OAuth2 Cognito Hosted UI Flow (Implemented)

1. **User initiates sign-in:**
   ```
   User → clicks "Sign In" button → AuthContext detects unauthenticated state
   ```

2. **Redirect to Cognito Hosted UI:**
   ```
   VITE_REDIRECT_SIGN_IN = https://idp-test.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize
   Parameters: client_id, redirect_uri, response_type=code, scope=openid+email+profile
   ```

3. **Cognito authenticates:**
   ```
   User enters email + password
   Cognito validates credentials, enforces MFA if enabled
   ```

4. **Authorization code returned:**
   ```
   Cognito → redirect to http://localhost:5173/auth/callback?code=AUTH_CODE
   ```

5. **Callback component processes code:**
   ```tsx
   // Callback.tsx
   const { code } = useSearchParams();
   const { authenticate } = useAuth();

   useEffect(() => {
     if (code) {
       authenticate(code); // Exchange code for tokens
     }
   }, [code]);
   ```

6. **Exchange authorization code for tokens:**
   ```
   POST /oauth2/token
   Body: {
     grant_type: "authorization_code",
     code: AUTH_CODE,
     client_id: VITE_COGNITO_USER_POOL_CLIENT_ID,
     redirect_uri: VITE_REDIRECT_SIGN_IN,
     client_secret: (if public client, not required)
   }

   Response: {
     access_token: "JWT_ACCESS_TOKEN",
     id_token: "JWT_ID_TOKEN",
     token_type: "Bearer",
     expires_in: 3600
   }
   ```

7. **Store tokens and redirect:**
   ```tsx
   // AuthContext stores tokens in memory/localStorage
   const [tokens, setTokens] = useState({ accessToken, idToken });

   // User is redirected to Dashboard or next step
   navigate('/dashboard', { replace: true });
   ```

8. **Authenticated requests:**
   ```
   Authorization: Bearer ACCESS_TOKEN
   All subsequent requests include this header via axios interceptor
   ```

### Session Management

- **Token Storage:** localStorage (or sessionStorage for ephemeral sessions)
- **Token Refresh:** Automatic via Amplify v6 (`fetchAuthSession`)
- **Session Expiry:** 1 hour access token, 30-day refresh token
- **Silent Re-auth:** Background refresh token exchange (transparent to user)
- **Sign Out:** Clear tokens + redirect to Cognito sign-out endpoint

### Implementation Details (useAuth Hook)

```tsx
// src/hooks/useAuth.tsx
import { useContext } from 'react';
import { AuthContext } from '../config/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Inside AuthProvider:
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Check existing session on mount
  const checkSession = async () => {
    const session = await fetchAuthSession();
    if (session.tokens?.accessToken) {
      setIsAuthenticated(true);
      setUser(session.tokens.idToken.payload); // Decode JWT
    }
    setLoading(false);
  };
  checkSession();
}, []);

// Expose authenticate(), logout(), etc.
```

---

## MSP-2011 — Component Library

### Shared Component Philosophy

**Design Principles:**
1. **Single Responsibility** — Each component does one thing well
2. **Composability** — Components are designed to work together
3. **Accessibility First** — WCAG 2.1 AA is non-negotiable
4. **Type Safety** — Full TypeScript support, no `any` types
5. **Testability** — Easy to test in isolation
6. **Maintainability** — Clear APIs, documentation, co-located tests

### Implemented Components

#### Alert
- **Purpose:** Display contextual feedback messages
- **Variants:** info, success, warning, error
- **Props:** `variant`, `title`, `description`, `onClose`
- **Accessibility:** `role="alert"`, `aria-live="polite"`

#### Button
- **Purpose:** Trigger actions or navigate
- **Variants:** primary, secondary, tertiary, ghost
- **Sizes:** small, medium, large
- **States:** default, hover, active, disabled, loading
- **Accessibility:** Proper `role`, `aria-label`, keyboard focus

#### Card
- **Purpose:** Container for related content
- **Props:** `header`, `footer`, `className`
- **Use Cases:** Profile sections, result summaries

#### Dropdown (Select)
- **Purpose:** Allow single selection from list
- **Props:** `options`, `value`, `onChange`, `label`
- **Accessibility:** Native `<select>` enhanced with ARIA

#### Input
- **Purpose:** Collect text input from user
- **Types:** text, email, password, number, tel
- **Props:** `label`, `error`, `helperText`, `required`
- **Accessibility:** Associated `<label>`, `aria-describedby`

#### MediaControls
- **Purpose:** Audio/video player controls
- **Features:** Play, pause, progress, volume, fullscreen
- **Props:** `src`, `onPlay`, `onPause`, `duration`

#### Modal (Dialog)
- **Purpose:** Display content in overlay, focus trap
- **Props:** `isOpen`, `onClose`, `title`, `children`
- **Accessibility:** `role="dialog"`, focus trap, ESC to close

#### Stepper
- **Purpose:** Show progress through multi-step process
- **Props:** `steps`, `activeStep`, `onStepChange`
- **Use Cases:** Onboarding flow, test completion

#### Timer
- **Purpose:** Countdown timer with warning states
- **Props:** `duration`, `onComplete`, `warningThreshold`
- **States:** active, warning, expired

#### Toast (Notifications)
- **Purpose:** Brief, non-modal notifications
- **Implementation:** Context-based with `useToast()` hook
- **Features:** Auto-dismiss, stacking, toast history
- **Accessibility:** `aria-live="polite"`, `role="status"`

#### Tooltip
- **Purpose:** Contextual help on hover or focus
- **Props:** `content`, `position`, `delay`
- **Accessibility:** Keyboard accessible, screen reader friendly

### Component API Pattern

All components follow this pattern:

```tsx
// Common component structure
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  // Required props
  label: string;

  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;

  // Callbacks
  onChange?: (value: string) => void;
  onClick?: () => void;

  // For extensibility
  className?: string;
  children?: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onChange,
  onClick,
  className,
  children,
}) => {
  const componentClass = [
    styles.component,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={componentClass} role="..." aria-label={label}>
      {children}
    </div>
  );
};

ComponentName.displayName = 'ComponentName';
export default ComponentName;
```

### Design Tokens (Two-Layer Architecture)

**Layer 1 — Brand Palette** (Swappable foundation):
```css
/* src/styles/variables.css */
:root {
  /* Color palette */
  --brand-primary: #FF6A00;
  --brand-secondary: #1F3A93;
  --brand-accent: #00D084;
  --brand-error: #E63946;

  /* Opacity support */
  --brand-primary-rgb: 255, 106, 0;
}
```

**Layer 2 — Semantic Tokens** (Component reference):
```css
:root {
  /* Actions */
  --color-action: var(--brand-primary);
  --color-action-hover: #E65A00;
  --color-action-active: #CC5000;

  /* Errors */
  --color-danger: var(--brand-error);
  --color-danger-action: var(--brand-error);

  /* Surfaces */
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F5F5F5;

  /* Typography */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #666666;

  /* Focus states */
  --color-focus-ring: var(--brand-primary);
  --color-focus-ring-faint: rgba(var(--brand-primary-rgb), 0.1);
}
```

### Styling Standards

- **CSS Modules only** — No inline styles, no external libraries
- **BEM naming within module** — `.btn`, `.btn--primary`, `.btn__icon`
- **Design token reference** — Use CSS variables, never hardcoded colors
- **Responsive design** — Mobile-first, breakpoint tokens
- **SVG icons** — No emoji or icon fonts

---

## Development Setup

### Prerequisites

- **Node.js** — v18.x or later (Active LTS)
- **npm** — v9.x or later
- **Git** — For version control
- **Editor** — VS Code recommended with TypeScript plugin

### Installation

```bash
# Clone repository
git clone https://gitlab.com/idp-education/idp-english-test/ui/iet-ui-testtaker.git
cd iet-ui-testtaker

# Install dependencies
npm install

# Create .env.development file (copy from .env.example)
cp .env.example .env.development

# Add local environment variables
# Edit .env.development with your Cognito credentials and API base URL
```

### Running Locally

```bash
# Start development server with HMR
npm run dev

# Application will be available at http://localhost:5173
```

### Port Configuration

**CRITICAL:** The dev server port MUST match Cognito's callback URL configuration.

- **Vite dev server port:** `5173` (in `vite.config.ts`)
- **Cognito callback URL:** `http://localhost:5173/auth/callback`
- **Environment variable:** `VITE_REDIRECT_SIGN_IN=http://localhost:5173/auth/callback`

If you need a different port, update all three places.

### Building for Production

```bash
# Build and optimize for production
npm run build

# Output written to dist/ directory
# Includes TypeScript type checking + Vite optimization

# Preview production build locally
npm run preview
```

---

## Development Scripts

### Setup & Install

```bash
npm install              # Install all dependencies
npm ci                   # Clean install (lockfile-only, CI recommended)
npm update               # Update dependencies to latest within constraints
npm audit                # Check for security vulnerabilities
```

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR on `http://localhost:5173` |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build locally on `http://localhost:4173` |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint on `src/` directory |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if files are properly formatted |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once (exit after completion) |
| `npm run test:ui` | Run tests with Vitest UI dashboard |
| `npm run test:coverage` | Run tests and generate coverage report |
| `npm run test:integration` | Run integration tests (separate config) |

### Example Workflow

```bash
# Start development
npm run dev

# In another terminal, watch for code quality issues
npm run lint:fix && npm run format

# Run tests in watch mode
npm run test

# Before committing
npm run build && npm run test:run

# Check code formatting
npm run format:check
```

---

## Environment Configuration

### Environment Variables

All environment variables use the `VITE_*` prefix (Vite convention for client-side vars).

#### `.env.example` (Public Template — Committed)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5173

# App Configuration
VITE_APP_NAME=IDP English Test
VITE_APP_VERSION=0.1.0

# Feature Flags
VITE_ENABLE_MOCK_SERVER=false
VITE_ENABLE_ANALYTICS=false

# Cognito Configuration (Test Taker Pool)
VITE_COGNITO_REGION=ap-southeast-1
VITE_COGNITO_USER_POOL_ID=
VITE_COGNITO_USER_POOL_CLIENT_ID=
VITE_COGNITO_DOMAIN=
VITE_REDIRECT_SIGN_IN=http://localhost:5173/auth/callback
VITE_REDIRECT_SIGN_OUT=http://localhost:5173/
```

#### `.env.development` (Local Secrets — Gitignored)

```bash
# Copy .env.example, then fill in your local Cognito credentials
VITE_COGNITO_USER_POOL_ID=ap-southeast-1_xxxxxxxxxxxxx
VITE_COGNITO_USER_POOL_CLIENT_ID=abc123def456ghi789
VITE_COGNITO_DOMAIN=idp-test
VITE_API_BASE_URL=http://localhost:8000  # Or your local API endpoint
```

#### `.env.production` (Production Secrets — Gitignored)

```bash
# Used when building for production deployment
VITE_API_BASE_URL=https://api.idp-test.com
VITE_COGNITO_USER_POOL_ID=ap-southeast-1_yyyyyyyyyyyyyy
VITE_COGNITO_USER_POOL_CLIENT_ID=xyz789uvw123def456
VITE_COGNITO_DOMAIN=idp-prod
VITE_ENABLE_ANALYTICS=true
```

#### `.env.test-integration` (Integration Test Secrets — Gitignored)

```bash
# Used when running integration tests against staging environment
VITE_API_BASE_URL=https://staging-api.idp-test.com
VITE_COGNITO_USER_POOL_ID=ap-southeast-1_zzzzzzzzzzzzzz
```

### Accessing Environment Variables

```tsx
// In any source file
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const appName = import.meta.env.VITE_APP_NAME;

// With type safety (src/config/env.ts)
import { getEnv } from '@config/env';

const env = getEnv();
console.log(env.VITE_API_BASE_URL);  // Type-checked, with fallback defaults
```

### .gitignore Configuration

```bash
# Real environment files (secrets)
.env
.env.local
.env.*.local
.env.development
.env.production
.env.test-integration

# Build outputs
dist/
build/

# Dependencies
node_modules/
npm-debug.log

# IDE
.vscode/
.idea/
*.swp

# Misc
.DS_Store
Thumbs.db
```

---

## Code Standards & Conventions

### TypeScript Configuration

- **Strict Mode:** `strict: true` (strictNullChecks, noImplicitThis, etc.)
- **JSX:** `jsx: "react-jsx"` (automatic JSX transform)
- **Module Resolution:** `bundler` (Vite-compatible)
- **Path Aliases:**
  - `@components` → `src/components`
  - `@hooks` → `src/hooks`
  - `@styles` → `src/styles`
  - `@config` → `src/config`
  - `@services` → `src/services`
  - `@types` → `src/types`
  - `@utils` → `src/utils`

### File & Folder Naming

| Item | Convention | Example |
|------|------------|---------|
| Component file | PascalCase | `Button.tsx` |
| Component folder | PascalCase | `src/components/Button/` |
| Hook file | `use` + PascalCase | `useAuth.tsx` |
| Style file | Same as component + `.module.css` | `Button.module.css` |
| Test file | Same as component + `.test.tsx` | `Button.test.tsx` |
| Utility file | camelCase | `validation.ts` |
| Type file | Descriptive + `.ts` | `auth.ts`, `api.ts` |

### Naming Conventions (Code)

| Item | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `Button`, `SignUpForm`, `Dashboard` |
| Hooks | `use` + PascalCase | `useAuth`, `useApi`, `useForm` |
| Functions | camelCase | `formatDate`, `validateEmail`, `handleSubmit` |
| Variables | camelCase | `isLoading`, `userData`, `onClickHandler` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PASSWORD_LENGTH`, `API_TIMEOUT_MS` |
| Types/Interfaces | PascalCase | `ButtonProps`, `User`, `ApiResponse` |
| Enums | PascalCase (singular) | `AlertVariant`, `FormFieldType` |
| CSS Classes | kebab-case or BEM | `.btn`, `.btn--primary`, `.btn__icon` |

### Component Structure

```tsx
// src/components/common/Button/Button.tsx
import React from 'react';
import styles from './Button.module.css';

/**
 * Button component
 * Reusable button with support for variants, sizes, and states
 */
interface ButtonProps {
  /** Button label/text */
  label: string;

  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /** Button size */
  size?: 'small' | 'medium' | 'large';

  /** Disabled state */
  disabled?: boolean;

  /** Loading state (shows spinner) */
  isLoading?: boolean;

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Additional CSS class */
  className?: string;

  /** Child elements */
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  onClick,
  className,
  children,
}) => {
  const buttonClass = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    disabled && styles['btn--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={label}
      aria-busy={isLoading}
    >
      {isLoading && <span className={styles['btn__spinner']} />}
      {children || label}
    </button>
  );
};

Button.displayName = 'Button';
export default Button;
```

### Component Testing Pattern

```tsx
// src/components/common/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with label', () => {
    render(<Button label="Click me" />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Test" onClick={handleClick} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button label="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<Button label="Loading..." isLoading />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('applies correct variant classes', () => {
    const { container } = render(<Button label="Secondary" variant="secondary" />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('btn--secondary');
  });
});
```

### Component Styling Standards

- **CSS Modules only** — No inline styles, no external libraries
- **BEM naming within module** — `.btn`, `.btn--primary`, `.btn__icon`
- **Design token reference** — Use CSS variables from `variables.css`
- **SVG icons only** — No emoji or icon fonts
- **Responsive design** — Mobile-first, breakpoint tokens

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