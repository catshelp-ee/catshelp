# How to run

1. Run the command ```npm install``` to install node dependencies
2. Create the .env file based on the example
3. You need to manually create the DB at the moment. (Use mariaDb)
    - a docker compose script has been provided in /scripts as well
4. To create the database tables first go to the prisma/ directory and run ```npx prisma generate``` and for:
    - Developer mode ```npx prisma migrate dev``` or ```npx prisma db push```;
    - Production mode ```npx prisma db push```.
5. ```npm run dev``` to run the app; ```npm run build``` to bundle the app.

# Deploying in zone
Github automatically deploys it to zone via a pipeline.


# Debugging

1. Create the debug configuration. Example in project root
2. Run frontend through commandline with ```npm run dev:vite```
3. Run the debugger

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
