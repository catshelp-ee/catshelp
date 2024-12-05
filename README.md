# How to run

1. Install deno (https://docs.deno.com/runtime/getting_started/installation/)
2. Run the command ```deno install``` to install node dependencies
3. Create the .env file based on the example
4. You need to manually create the DB at the moment. Currently the DB info is in api\main.ts file. Will be refactored soon.
5. ```deno task dev``` to run the app


# Debugging

1. Install the VS Code extension: https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno
2. Create the debug configuration. Example in project root
3. Run frontend through commandline with ```deno task dev:vite```
4. Run the debugger

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
