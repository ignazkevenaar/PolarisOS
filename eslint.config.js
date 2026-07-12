import js from "@eslint/js";
import globals from "globals";
import pluginAstro from "eslint-plugin-astro";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  ...pluginAstro.configs.recommended,
  {
    // Mitigates ESLint flagging return functions in .astro front matter, even though they are valid.
    // https://github.com/ota-meshi/eslint-plugin-astro/issues/459#issuecomment-2845812351
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          globalReturn: true,
        },
      },
    },
  },
  pluginVue.configs["flat/essential"],
]);
