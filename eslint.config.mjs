import js from "@eslint/js";
import globals from "globals";


export default [
  ...js.configs.recommended.map(config => ({
    ...config,
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    languageOptions: { 
      ...(config.languageOptions || {}),
      globals: globals.browser
    }
  })),
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
];
