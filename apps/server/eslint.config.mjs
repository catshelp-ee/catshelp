import rootConfig from '../../eslint.config.js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    ...rootConfig,
    {
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
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'func-style': ['error', 'expression'],
        },
    }
)