import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import codegen from 'eslint-plugin-codegen';
import _import from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import unusedImports from 'eslint-plugin-unused-imports';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['**/dist', '**/build', '**/docs', '**/*.md', 'src/public']
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@effect/recommended'
  ),
  {
    plugins: {
      import: _import,
      'sort-destructure-keys': sortDestructureKeys,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      codegen
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts']
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true
        }
      }
    },

    rules: {
      'codegen/codegen': 'error',
      'object-shorthand': 'error',
      'no-restricted-syntax': ['error', {
        selector: 'CallExpression[callee.property.name=\'push\'] > SpreadElement.arguments',
        message: 'Do not use spread arguments in Array.push'
      }],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
        },
      ],
      'sort-destructure-keys/sort-destructure-keys': 'error',
      '@typescript-eslint/array-type': ['warn', {
        default: 'array',
        readonly: 'array'
      }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@effect/dprint': ['error', {
        config: {
          indentWidth: 2,
          lineWidth: 120,
          semiColons: 'always',
          quoteStyle: 'alwaysSingle',
          trailingCommas: 'never',
          operatorPosition: 'maintain',
          'arrowFunction.useParentheses': 'preferNone'
        }
      }]
    }
  }
];
