const { join } = require("path");
const extensions = [".ts", ".mjs", ".js", ".json"];
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:node/recommended-module",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:unicorn/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/unicorn",
  ],
  env: { node: true, browser: false, es6: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: join(__dirname, "..", "tsconfig.json"),
    tsconfigRootDir: join(__dirname, ".."),
  },
  plugins: ["@typescript-eslint", "unicorn"],
  rules: {
    "@typescript-eslint/default-param-last": "error",
    "@typescript-eslint/naming-convention": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/return-await": "error",
    "@typescript-eslint/unified-signatures": "error",
    "no-await-in-loop": "error",
    "prefer-template": "error",
    "sort-vars": "error",
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/no-null": "off",
    "unicorn/no-reduce": "off",
    "unicorn/prefer-set-has": "off",
    "unicorn/prevent-abbreviations": "off",
    yoda: ["error", "never", { exceptRange: true }],
  },
  settings: { "import/resolver": { node: { extensions } }, node: { tryExtensions: extensions } },
};
