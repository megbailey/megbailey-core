import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname =
    typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@megbailey/utils": path.join(dirname, "../utils/index.ts"),
        },
    },
    test: {
        name: "unit",
        environment: "jsdom",
        setupFiles: [path.join(dirname, "vitest.setup.ts")],
        include: ["**/*.test.{ts,tsx}"],
        exclude: ["node_modules/**", "dist/**"],
        fileParallelism: false,
        coverage: {
            provider: "v8",
            include: ["components/**/*.{ts,tsx}"],
            exclude: ["**/*.stories.{ts,tsx}", "**/*.test.{ts,tsx}", "**/types.ts"],
        },
    },
});
