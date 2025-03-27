import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactRecommended from "eslint-plugin-react/configs/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  // Recommended base configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      
      // React hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Next.js specific rules
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      
      // General best practices
      "no-console": "warn",
      "no-unused-expressions": "warn",
      
      // React recommended settings with some adjustments
      "react/prop-types": "off", // Disable as we're using TypeScript
      "react/react-in-jsx-scope": "off", // Not needed in modern React
    },
    
    // Settings to help ESLint understand React and TypeScript
    settings: {
      react: {
        version: "detect"
      }
    },
    
    // Ignore specific files or patterns
    ignores: [
      ".next/",
      "node_modules/",
      "build/",
      "dist/",
      "**/*.config.js",
      "**/*.config.ts"
    ]
  },
  
  // Adjust React-specific configs
  {
    ...reactRecommended,
    rules: {
      ...reactRecommended.rules,
      "react/prop-types": "off"
    }
  }
);