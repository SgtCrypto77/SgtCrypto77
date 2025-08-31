module.exports = [{
    languageOptions: { ecmaVersion: 2021 },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      "no-redeclare": "error",
      "no-duplicate-imports": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "require-await": "error",
      "no-useless-escape": "off"
    }
  }];
