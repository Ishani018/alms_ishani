// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],

    // what used to be in .eslintignore
    ignores: ["node_modules/**", "dist/**", "coverage/**"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // so test/describe/expect are allowed
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // so <App />, <Login /> etc. are understood
        },
      },
    },

    rules: {
      // start from recommended rules
      ...js.configs.recommended.rules,

      // turn off unused-vars so imports like React, Router, etc. don’t fail lint
      "no-unused-vars": "off",
    },
  },
];
