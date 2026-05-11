import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Frontend ESLint Configuration
 *
 * This configuration is anchored to the frontend workspace root to resolve
 * monorepo ambiguity. It uses the TypeScript-ESLint Project Service for
 * high-performance type-safe linting.
 */
export default tseslint.config(
  // 1. Global Ignores
  {
    ignores: [
      'dist',
      'eslint.config.mjs',
      'eslint.config.js',
      'vite.config.ts',
    ],
  },

  // 2. Base Configuration
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        // Explicitly anchor to this directory to prevent monorepo candidates collision
        tsconfigRootDir: import.meta.dirname,
        // Safety fallback for files not explicitly in a tsconfig include
        allowDefaultProject: true,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
);
