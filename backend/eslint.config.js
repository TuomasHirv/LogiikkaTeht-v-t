const js = require("@eslint/js")
const globals = require("globals")

module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      // catches typos and missing requires (e.g. using `path` without requiring it)
      "no-undef": "error",

      "preserve-caught-error": "off",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["error", "smart"],
      "no-var": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "no-return-await": "error",
      "require-await": "warn",
    },
  },
]
