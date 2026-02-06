// ESLint v9+ flat config (replaces .eslintrc.*)
// Keeping rules aligned with the previous `.eslintrc.cjs` to avoid behavior surprises.

const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');

/** @type {import("eslint").Linter.FlatConfig[]} */

module.exports = [
    {
        ignores: ['dist/**', 'node_modules/**', '.next/**', 'out/**', 'coverage/**'],
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
            // Minimal globals matching the previous env: { browser: true, node: true }
            globals: {
                // browser
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                location: 'readonly',
                history: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                Headers: 'readonly',
                Request: 'readonly',
                Response: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',

                // node
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                module: 'readonly',
                require: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'unused-imports': unusedImportsPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...(tsPlugin.configs.recommended?.rules ?? {}),
            ...(importPlugin.configs.recommended?.rules ?? {}),
            ...(importPlugin.configs.typescript?.rules ?? {}),
            ...(reactPlugin.configs.recommended?.rules ?? {}),
            ...(reactHooksPlugin.configs.recommended?.rules ?? {}),
            ...(prettier?.rules ?? {}),

            // Project overrides (from `.eslintrc.cjs`)
            'import/no-unresolved': 'off',
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
                    pathGroups: [
                        { pattern: 'react', group: 'external', position: 'before' },
                        { pattern: '@/**', group: 'internal', position: 'after' }, // alias @/...
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/newline-after-import': ['error', { count: 1 }],

            // React 17+ JSX transform does not require React in scope
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            // TypeScript handles props typing
            'react/prop-types': 'off',

            // Existing codebase uses refs/state in ways this rule flags
            'react-hooks/refs': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/preserve-manual-memoization': 'off',

            // Allow literal quotes/apostrophes in JSX text
            'react/no-unescaped-entities': 'off',

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
];




























