const reactPlugin = require('eslint-plugin-react');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');


module.exports = [
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            globals: {
                browser: true,
                es2021: true
            },
            ecmaVersion: 12,
            sourceType: 'module'
        },
        plugins: {
            react: reactPlugin
        },
        rules: {
            ...reactPlugin.configs.recommended.rules
            // Your custom rules for JavaScript and JSX files
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            globals: {
                browser: true,
                es2021: true
            },
            ecmaVersion: 12,
            sourceType: 'module'
        },
        parser: tsParser,
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin
        },
        rules: {
            ...typescriptEslintPlugin.configs.recommended.rules
            // Your custom rules for TypeScript and TSX files
        }
    }
];
