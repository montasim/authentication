import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';

export default [
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'], // Lint JavaScript and TypeScript files
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser, // Use browser globals
                jest: 'readonly', // Include Jest globals
            },
        },
        plugins: {
            react: pluginReact, // React plugin
            jsxA11y: pluginJsxA11y, // Accessibility plugin
        },
        rules: {
            // General JavaScript/ESLint rules
            'no-console': [
                'warn',
                { allow: ['error', 'warn', 'info', 'debug'] },
            ],
            'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': ['error', 'always'],
            'prefer-template': 'error',
            eqeqeq: ['error', 'always'],
            semi: ['error', 'always'],
            quotes: [
                'error',
                'single',
                { avoidEscape: true, allowTemplateLiterals: true },
            ],
            'no-duplicate-imports': 'error',
            'arrow-spacing': ['error', { before: true, after: true }],
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'no-new-symbol': 'error',
            'symbol-description': 'error',
            'template-curly-spacing': 'error',

            // React and JSX rules
            'react/react-in-jsx-scope': 'off', // Not needed for Next.js since React 17+
            'react/jsx-uses-react': 'off', // Not needed for Next.js since React 17+
            'react/prop-types': 'off', // Disable prop-types as we're using TypeScript or prefer not to enforce it
            'jsx-a11y/anchor-is-valid': 'off', // Disables warnings about invalid anchor tags for Next.js Link component
        },
        ignores: [
            '.idea/**',
            '.yarn/**',
            'node_modules/**',
            'build/**',
            'logs/**',
            'yarn.lock',
            'documentation/**',
            '.next/**',
        ],
    },
];
