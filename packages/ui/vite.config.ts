import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

/** Keep npm dependencies external — same output shape as tsc (unbundled ESM). */
function isExternal(id: string): boolean {
    return !id.startsWith(".") && !path.isAbsolute(id);
}

/**
 * Vite lib mode extracts CSS and replaces imports with `/* empty css *\/`.
 * Restore side-effect imports so consumers load styles when importing components.
 */
function restoreCssSideEffectImports(): Plugin {
    return {
        name: "restore-css-side-effect-imports",
        generateBundle(_options, bundle) {
            for (const [fileName, item] of Object.entries(bundle)) {
                if (item.type !== "chunk" || !fileName.endsWith(".js")) {
                    continue;
                }

                const cssFileName = fileName.replace(/\.js$/, ".css");
                if (!(cssFileName in bundle)) {
                    continue;
                }

                const cssImportPath = `./${path.basename(cssFileName)}`;
                item.code = item.code.replace(/\/\* empty css[^*]*\*\/\s*/g, "");

                if (!item.code.includes(cssImportPath)) {
                    item.code = `import "${cssImportPath}";\n${item.code}`;
                }
            }
        },
    };
}

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: path.resolve(packageRoot, "index.ts"),
            formats: ["es"],
            fileName: "index",
        },
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
        cssCodeSplit: true,
        rollupOptions: {
            external: isExternal,
            plugins: [restoreCssSideEffectImports()],
            output: {
                preserveModules: true,
                preserveModulesRoot: packageRoot,
                entryFileNames: "[name].js",
            },
        },
    },
});
