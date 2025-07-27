import { PluginOption, defineConfig } from "vite";
import fs from "node:fs";
import path from "path";
import { execSync } from "child_process";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    console.log("Building in", mode);
    return {
        plugins: [react(), tailwindPlugin, bundlePlugin],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        base: "./",
        build: {
            cssCodeSplit: false,
            cssMinify: true,
            emptyOutDir: false,
            outDir: "dist",
            minify: true,
            sourcemap: false,
            rollupOptions: {
                input: {
                    'react-userscripts.user': 'src/index.tsx'
                },
                external: [],
                output: {
                    entryFileNames: '[name].js',
                    format: 'iife',
                    name: 'ReactUserscripts',
                    globals: {}
                }
            },
        },
        preview: {
            port: 8124,
            strictPort: true,
        },
        define: {
            // Don't pick up weird variables from `NODE_ENV`
            // https://github.com/vitejs/vite/discussions/13587
            "process.env.NODE_ENV": JSON.stringify(mode),
        },
    };
});

// Plugin para executar Tailwind CSS antes do build
const tailwindPlugin: PluginOption = {
    name: "tailwind-plugin",
    apply: "build",
    enforce: "pre",
    buildStart() {
        console.log("\nExecutando Tailwind CSS...");
        try {
            execSync("npx @tailwindcss/cli -i ./src/globals.css -o ./src/App.css --minify", {
                stdio: "inherit",
                cwd: process.cwd()
            });
            console.log("Tailwind CSS executado com sucesso!");
        } catch (error) {
            console.error("Erro ao executar Tailwind CSS:", error);
            throw error;
        }
    }
};

const bundlePlugin: PluginOption = {
    name: "bundle-plugin",
    apply: "build",
    enforce: "post",
    generateBundle(options, bundle) {
        // Gather all the CSS together to be injected later
        let css = "";
        for (const fileName in bundle) {
            const chunk = bundle[fileName];
            if (chunk.type === "asset" && chunk.fileName.endsWith(".css")) {
                console.log(
                    "\nFound CSS chunk",
                    chunk.fileName,
                    "Inlining and removing from bundle."
                );
                css += chunk.source;
                delete bundle[fileName];
            }
        }
        for (const fileName in bundle) {
            const chunk = bundle[fileName];
            if (chunk.type === "chunk") {
                // This may mess the source map :-(
                chunk.code = addHeader(chunk.code);

                // Inject the CSS into the bundle
                chunk.code += `;\n(function(){
                    const el = document.createElement("style");
                    el.innerText = ${JSON.stringify(css)};
                    el.type = "text/css";
                    document.head.appendChild(el);
                })();`;
            }
        }
        function addHeader(code: string) {
            const header = fs.readFileSync("src/userscript-header.js", "utf-8");
            console.log("\nAdding header to userscript:\n", header);
            return `${header}\n${code}`;
        }
    },
};
