import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ),
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^(copy|close|handle|on)[A-Z].*",
          argsIgnorePattern: "^_",
        },
      ],
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 9,
      sourceType: "commonjs",
    },
  },
  {
    // Special config for config files
    files: ["*.config.{js,mjs,cjs}", "*.setup.{js,mjs,cjs}"],
    languageOptions: {
      parserOptions: {
        project: null, // Disable type-checking for config files
      },
    },
  },
]);
