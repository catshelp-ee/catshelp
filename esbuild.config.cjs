const path = require("path");
const esbuild = require("esbuild");
const alias = require("esbuild-plugin-alias");

esbuild.build({
  entryPoints: ["server/main.ts"], // <-- Use source, not dist
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  outfile: "../dist/bundle.cjs",
  external: [
    "@prisma/client",  // Prisma should not be bundled
    "*.node",
    "pg-hstore",
    "path",
    "fs",
    "url",
    "crypto",
    "stream",
    "buffer",
    "util",
    "events"
  ],
  plugins: [
    alias({
      "@": path.resolve(__dirname, "server") // or "src" if that's your base
    })
  ]
}).catch(() => process.exit(1));
