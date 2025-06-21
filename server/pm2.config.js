module.exports = {
  apps: [
    {
      name: "catshelp-api",
      script: "./bundle.cjs", // or "./main.js" if not bundling
      instances: 1,
      exec_mode: "fork", // or "cluster" for multi-core
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 8080, // adjust if needed
      },
    },
  ],
};
