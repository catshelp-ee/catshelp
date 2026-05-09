import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// 1. Import the plugin (using the modern 'x' version for ESLint 10 support)
import importX from 'eslint-plugin-import-x';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      'prettier.config.js',
    ],
  },
  {
    // 2. Define the 'import' plugin here
    plugins: {
      import: importX,
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          alphabetize: { order: 'asc' },
          'newlines-between': 'always',
        },
      ],
      'no-console': 'warn',
      'prefer-arrow-callback': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  // Prettier goes last to disable conflicting rules
  eslintPluginPrettierRecommended,
);
