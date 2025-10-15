import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  envDir: path.resolve(__dirname, ".."),
  plugins: [react(), tsconfigPaths()],
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
  build: {
    sourcemap: true,
  },
});
