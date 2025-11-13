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

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Next.js recommends enabling all the rules via plugin
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      // add any custom overrides here
    },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
];

export default eslintConfig;
