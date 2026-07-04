import type { StorybookConfig } from "@storybook/react-vite";

import { dirname, join } from "path";

import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const config: StorybookConfig = {
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../components/**/*.mdx",
        "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        getAbsolutePath("@chromatic-com/storybook"),
        getAbsolutePath("@storybook/addon-vitest"),
        getAbsolutePath("@storybook/addon-a11y"),
        getAbsolutePath("@storybook/addon-docs"),
        getAbsolutePath("@storybook/addon-mcp"),
    ],
    framework: getAbsolutePath("@storybook/react-vite"),
    async viteFinal(config) {
        const { mergeConfig } = await import("vite");

        // Resolve workspace utils from TypeScript source so Vite gets ESM named exports.
        // The compiled dist output is CommonJS, which Storybook/Vite cannot import directly.
        return mergeConfig(config, {
            resolve: {
                alias: {
                    "@megbailey/utils": join(__dirname, "../../utils/index.ts"),
                },
            },
        });
    },
};
export default config;
