// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * Root ESLint Configuration
 * 
 * This config acts as a fallback and global policy for the monorepo.
 * We disable '@typescript-eslint/no-unsafe-assignment' here to prevent 
 * a known engine crash occurring in ESLint v10 + TypeScript v5/6 environments.
 */
export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/generated/**", "eslint.config.mjs"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  },
  eslintConfigPrettier,
);
