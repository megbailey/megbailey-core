import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname =
    typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Browser-based Storybook tests. Run via: npm run test:storybook
export default defineConfig({
    plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
    resolve: {
        alias: {
            "@megbailey/utils": path.join(dirname, "../utils/index.ts"),
        },
    },
    test: {
        name: "storybook",
        browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
        },
    },
});
