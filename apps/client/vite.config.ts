import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import path, { join } from 'path';
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const pathToEnv = join(__dirname, '../../.env');
dotenv.config({ path: pathToEnv });

export default defineConfig({
    envDir: pathToEnv,
    plugins: [react(), tsconfigPaths()],
    build: {
        outDir: './../../build/client',
        emptyOutDir: true,
        sourcemap: true,
    },
    server: {
        port: process.env.FRONTEND_PORT,
        strictPort: true,
        proxy: {
            "/api": {
                target: process.env.VITE_BACKEND_URL,
                changeOrigin: true,
            },
            "/images": {
                target: process.env.VITE_BACKEND_URL,
                changeOrigin: true,
            },
        },
    },
});