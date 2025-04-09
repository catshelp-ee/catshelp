import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
dotenv.config();

export default defineConfig({
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
