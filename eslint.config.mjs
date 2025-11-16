import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // ✅ Added Jest globals here
      },
    },
  },
  {
    ignores: [
      "node_modules/",
      "coverage/",
      "dist/",
      "build/"
    ]
  }
];