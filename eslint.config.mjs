// import nextPlugin from "@next/eslint-plugin-next";
// import globals from "globals";

// /** @type {import('eslint').Linter.FlatConfig[]} */
// const eslintConfig = [
//   {
//     files: ["**/*.{js,jsx,ts,tsx}"],
//     plugins: {
//       "@next/next": nextPlugin,
//     },
//     rules: {
//       ...nextPlugin.configs.recommended.rules,
//       ...nextPlugin.configs["core-web-vitals"].rules,
//     },
//     languageOptions: { globals: { ...globals.browser, ...globals.node } },
//   },
// ];

// export default eslintConfig;
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import typescriptParser from "@typescript-eslint/parser";  // ← ADD THIS

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    languageOptions: {  // ← MODIFIED
      parser: typescriptParser,  // ← ADD THIS
      parserOptions: {           // ← ADD THIS
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
