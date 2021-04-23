module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    sourceType: 'module',
    createDefaultProgram: true,
  },
  plugins: ['@typescript-eslint', 'react'],
  root: true,
  // see: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
  rules: {
    'react/jsx-uses-react': [1],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    indent: 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    'eol-last': ['error', 'always'],
    'func-style': [
      'error',
      'expression',
      {
        allowArrowFunctions: true,
      },
    ],
    'no-dupe-class-members': 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-spread': 'error',
    'require-yield': 'error',
    '@typescript-eslint/quotes': ['error', 'single'],
    'react/jsx-uses-vars': 1,
    'require-jsdoc': 'off',
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreStrings: true,
      },
    ],
    'new-cap': [
      'error',
      {
        newIsCap: false,
      },
    ],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
      },
    ],
  },
};
