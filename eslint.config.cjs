module.exports = [
  {
    ignores: [
      'server.js',
      'bedrock-admin/server.js',
      '**/*.bak.*',
      '**/server.js'
    ],
  },
  {
    languageOptions: { ecmaVersion: 2021, sourceType: 'script' },
    rules: {
      'no-redeclare': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'require-await': 'error',
      'no-useless-escape': 'off'
    }
  }
];
