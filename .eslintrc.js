module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true, 
  },
  extends: [
    'airbnb/hooks',
    'airbnb',
    'prettier',
    'plugin:storybook/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'json-format',
    'simple-import-sort',
    '@emotion',
    'prettier',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/extensions': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx'],
      },
    ],
  },
  ignorePatterns: ['**/build/**/*', '.eslintrc.js', 'craco.config.js'],
  settings: {
    'import/resolver': {
      node: {},
    },
  },
};
