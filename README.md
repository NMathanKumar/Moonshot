# IDP English Test - Test Taker Portal MVP

**Project:** MSP-2427 - React Project Skeleton  
**Status:** In Progress  
**Version:** 0.1.0

## Overview

This is the React-based frontend application for the IDP English Test (Moonshot) Test Taker Portal. The project includes:

- ✅ React 18 with Vite build tool
- ✅ Professional project structure (scalable architecture)
- ✅ Mock Server (MSW) for API calls
- ✅ ESLint & Prettier for code quality
- ✅ Vitest + React Testing Library for testing
- ✅ Plain CSS with CSS variables for styling
- ✅ Login screen with form validation

## Tech Stack

| Tool       | Version | Purpose                  |
|-----------|---------|--------------------------|
| React     | 18.2.0  | UI framework             |
| Vite      | 5.0.0   | Build tool & dev server  |
| Vitest    | 1.0.0   | Unit testing             |
| ESLint    | 8.54.0  | Code linting             |
| Prettier  | 3.1.0   | Code formatting          |
| MSW       | 1.3.0   | Mock API server          |

## Project Structure

```
src/
├── assets/              # Images, logos, fonts
├── components/          # React components
│   ├── common/         # Reusable components (Button, Input, etc.)
│   └── features/       # Feature-specific components (Auth, Dashboard, etc.)
├── pages/              # Page-level components
├── services/           # API and business logic
│   ├── api/           # API client & endpoints
│   └── mock/          # Mock Service Worker setup
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── config/            # Configuration & constants
└── styles/            # Global CSS & variables
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Command           | Description                          |
|------------------|--------------------------------------|
| `npm run dev`     | Start development server (with HMR) |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build             |
| `npm run lint`    | Check code quality                   |
| `npm run lint:fix`| Fix linting issues                   |
| `npm run format`  | Format code with Prettier            |
| `npm run test`    | Run tests with Vitest               |
| `npm run test:ui` | Run tests with UI dashboard         |
| `npm run test:coverage` | Generate coverage report    |

## Environment Configuration

### Development (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=IDP English Test (Dev)
VITE_ENABLE_MOCK_SERVER=true
VITE_ENABLE_ANALYTICS=false
```

### Production (`.env.production`)
```env
VITE_API_BASE_URL=https://api.idpenglishtest.com
VITE_APP_NAME=IDP English Test
VITE_ENABLE_MOCK_SERVER=false
VITE_ENABLE_ANALYTICS=true
```

## Mock API

The application uses **Mock Service Worker (MSW)** to intercept API calls.

### Test Credentials

**Login:**
- Email: `test@idp.com`
- Password: `Password123!`

### Mock Endpoints

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/signup` - Sign up
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile

See `src/services/mock/handlers.js` for full endpoint definitions.

## Component Examples

### Button Component
```jsx
import { Button } from '@components/common';

<Button 
  variant="primary" 
  size="large" 
  isLoading={loading}
  fullWidth
>
  Sign In
</Button>
```

### Input Component
```jsx
import { Input } from '@components/common';

<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

### useAuth Hook
```jsx
import { useAuth } from '@hooks';

const { login, isLoading, error } = useAuth();
```

## Form Validation

Password policy is enforced:
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

See `src/utils/validation.js` for validation utilities.

## Testing

Run tests with:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

Generate coverage report:

```bash
npm run test:coverage
```

## Code Quality

### Linting

```bash
npm run lint          # Check for issues
npm run lint:fix      # Automatically fix issues
```

### Formatting

```bash
npm run format        # Format all files
npm run format:check  # Check if files are formatted
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Project architecture overview
- [API Integration](./docs/API_INTEGRATION.md) - How to integrate with backend APIs
- [Component Guide](./docs/COMPONENT_GUIDE.md) - Component development guide
- [Testing Guide](./docs/TESTING.md) - Testing best practices
- [Styling Guide](./docs/STYLING.md) - CSS and styling conventions

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Module Import Errors

Make sure all import paths use the configured aliases:
- `@components` → `src/components`
- `@pages` → `src/pages`
- `@services` → `src/services`
- `@hooks` → `src/hooks`
- `@utils` → `src/utils`

### Mock Server Not Working

Ensure `VITE_ENABLE_MOCK_SERVER=true` in `.env.development` and check browser console for errors.

## Future Tasks

- **MSP-2428**: Implement Sign Up screen
- **MSP-2429**: Implement Onboarding flow
- **MSP-2430**: Implement Dashboard
- **Future**: Replace mock server with real backend APIs

## License

Proprietary - IDP Group

## Support

For issues or questions, contact the development team.
