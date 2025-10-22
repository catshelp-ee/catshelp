import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import { join } from 'path';
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
dotenv.config({ path: join(__dirname, '/../.env') });

export default defineConfig({
  envDir: join(__dirname, '/../.env'),
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
    },
  },
});
