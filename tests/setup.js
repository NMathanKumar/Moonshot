/**
 * Test Setup
 * Configure Vitest with Testing Library matchers.
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest with jest-dom matchers (toBeInTheDocument, etc.)
expect.extend(matchers);

// Clean up rendered components after each test
afterEach(() => {
  cleanup();
});
