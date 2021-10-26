module.exports = {
  root: true,
  <%_ if (hasTypeScript) { _%>
  parser: '@typescript-eslint/parser',
  <%_ } _%>
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    'plugin:prettier/recommended', // Make sure this is always the last element in the array.
  ],
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    <%_ if (hasTypeScript) { _%>
    '@typescript-eslint/explicit-function-return-type': 'off',
    <%_ } _%>
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
