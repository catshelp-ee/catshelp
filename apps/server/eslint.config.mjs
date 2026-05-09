import rootConfig from '../../eslint.config.mjs';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(...rootConfig, {
    files: ['**/*.{ts,tsx}'],
    plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
    },
    languageOptions: {
        globals: globals.browser,
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    rules: {
        ...reactHooks.configs['recommended-latest'].rules,
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        // Enforces 'function App() {}' instead of 'const App = () => {}'
        'func-style': ['error', 'declaration', { allowArrowFunctions: true }],

        // Optional: ensures you don't use 'var' or 'let' for functions
        'prefer-arrow-callback': 'error',
    },
});
