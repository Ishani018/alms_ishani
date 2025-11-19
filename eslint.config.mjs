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
    rules: {
      // Allow unused variables in test files
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }]
    }
  },
  {
    // Test files can have unused variables (for mocking, etc.)
    files: ["**/*.test.js", "**/tests/**/*.js"],
    rules: {
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }]
    }
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