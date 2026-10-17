// ESLint flat config (Phase 0B). TypeScript recommended rules plus the two
// classic React hooks rules. Existing violations are disabled inline with a
// reason rather than "fixed" by changing behavior; see docs/REFACTOR_PROGRESS.md.
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      // Battle replays are left out of every check until videos replace them (2026-10-17).
      'src/battlefield/**',
      'public/**',
      'tmp/**',
      'test-results/**',
      'playwright-report/**',
      'server/node_modules/**',
      'server/audio-cache/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      // `_name` marks a deliberately unused parameter or binding.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // `try { localStorage… } catch {}` is the app's pattern for storage that may be blocked.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: ['api/**', 'shared/**', 'scripts/**', 'server/**', 'tests/**', '*.{js,cjs,mjs,ts}'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    // One-off and legacy scripts that Phase 3 archives or replaces (plan, "Phase 3"):
    // unused leftovers there are not worth editing before they go.
    files: ['server/index.js', 'scripts/capture-*.mjs', 'scripts/migrate-to-cloudflare-r2.js'],
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
