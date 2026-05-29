// @ts-check
import nextConfig from 'eslint-config-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const config = [
  // Next.js flat config (array of config objects)
  ...nextConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Apostrophes and quotes in JSX text are readable as-is.
      'react/no-unescaped-entities': 'off',
      // setState in useEffect is intentional for localStorage/browser-API hydration
      // patterns used throughout this project (useSafeLocalStorage, detectLocale).
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'data/resources.embedded.json'],
  },
];

export default config;
