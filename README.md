# How to run

1. Run the command ```npm install``` to install node dependencies
2. Create the .env file based on the example
3. You need to manually create the DB at the moment. (Use mariaDb)
    - a docker compose script has been provided in /scripts as well
4. Build the app to before running migrations: ```npm run build```
5. You have to run the frontend and backend on different instances
    - To run the frontend execute ```npm run client```
    - To run the backend execute ```npm run server```

# Deploying in zone
Github automatically deploys it to zone via a pipeline.

# Migrations
Creating a migration script:
```npm run migration:create:unix --name=test```
```npm run migration:create:windows --name=test```

Migrating scripts:
```npm run migration:run```


# Debugging

1. Create the debug configuration. Example in project root
2. Run frontend through commandline with ```npm run client```
3. Run the debugger


# Random info
hookified is explicitly added to server/package.json because some npm bug. It won't get it as a subdependency for a package and error occurs on startup.