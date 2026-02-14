import globals from "globals";

export default [
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-constant-condition": "warn",
      "no-debugger": "error",
      "no-duplicate-case": "error",
      "no-empty": "warn",
      "no-extra-semi": "warn",
      "no-unreachable": "error",
      "eqeqeq": ["warn", "always"],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    ignores: ["**/node_modules/", "scripts/node_modules/"],
  },
];
