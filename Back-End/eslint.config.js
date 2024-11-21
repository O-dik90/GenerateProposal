const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['node_modules', 'dist'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': [
        'error', // Show Prettier issues as ESLint errors
        {
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          printWidth: 80,
          trailingComma: 'es5',
        },
      ], // Show Prettier issues as ESLint errors
      'no-unused-vars': 'warn', // Example rule
    },
  },
];
