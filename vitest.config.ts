import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
