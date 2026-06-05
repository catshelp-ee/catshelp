# How to run
1. Download Laravel Herd for easy php development
https://herd.laravel.com/windows
2. In Laravel Herd general tab add catshelp/apps folder under Herd paths (Herd should automatically deploy the app)
3. Run ```npm install``` in the root folder to install node dependencies
4. Add environment files
    Create the .env file in root folder based on the example
    Create the .env file in apps/server folder based on the example
    Add credentials.json to root folder
5. You need to manually create the DB at the moment. (Use mariaDb)
6. Run ```npm install``` install in app\server folder
7. Build the app to before running migrations: ```npm run build```
8. To run the frontend execute ```npm run client```

# Migrating from Node server
1. Comment out all code in public function up(): void for every migration
2. Remove migration table from database
3. Move images from \images folder to apps\server\storage\app\private\images then delete images folder
4. Remove \files folder

# Deploying in zone
Deploy needs to be redone.
Run composer update

# Migrations
For creating a migration table in db
```php artisan migrate:install```

Run migrations
```php artisan migrate```

Creating a migration script:
```php artisan make:migration script-name```


# Debugging
See how to turn on xdebug in php:
https://herd.laravel.com/docs/windows/debugging/xdebug

Download the Xdebug helper by Jetbrains extension for your browser
Create a launch json in vscode
Run with F5
