import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react: react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Unused imports - báo lỗi khi có import thừa
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // TypeScript rules - báo lỗi TypeScript
      "@typescript-eslint/no-unused-vars": "off", // Tắt rule này vì đã dùng unused-imports
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",

      // React rules
      "react/react-in-jsx-scope": "off", // Không cần import React trong React 17+
      "react/prop-types": "off", // Dùng TypeScript thay vì prop-types
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-unused-vars": "off", // Tắt rule này vì đã dùng unused-imports
      "no-undef": "error",
    },
  },
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "routeTree.gen.ts",
      "*.config.js",
      "*.config.ts",
    ],
  },
];
