# CatsHelp Server-Side Documentation

## Setup and Deployment
### Environment Setup
1. Ensure Node.js and npm are installed on your system.
2. Copy `.env.example` (if available) to `.env` and configure necessary environment variables such as `JWT_SECRET`, `TOKEN_LENGTH`, `BACKEND_PORT`, and Google API credentials.
3. Install dependencies:
   ```
   npm install
   ```

### Running the Server
Run the server using the provided script:
```
npm run serve
```
This will build and start the server on the port defined in your environment variables (default likely 8080).

### Deployment
For production deployment, use PM2 as configured in `pm2.config.js`:
```
pm2 start pm2.config.js
```
Ensure environment variables are set appropriately for the production environment.

## API Endpoints
### Public Endpoints
- **POST /api/login-google**: Authenticate via Google OAuth.
- **POST /api/login-email**: Authenticate via email.
- **GET /api/verify**: Verify user token.
- **POST /api/logout**: Logout user.

### Secure Endpoints (Require Authentication)
- **GET /api/user**: Retrieve user data.
- **GET /api/animals/dashboard**: Fetch dashboard data for pets.
- **GET /api/animals/cat-profile**: Retrieve cat profile data.

## Database and Integrations
### Database
The application uses **Prisma ORM** for database interactions, with schema definitions in the `prisma` directory. Custom extensions, such as generating unique rank numbers for animal rescues, are defined in `prisma.ts`.

### External Integrations
- **Google Sheets**: Used for data storage and retrieval, particularly for dashboard data (`DashboardService`).
- **Google Drive**: Used for image storage and retrieval (`ImageService`).

## Troubleshooting and Maintenance
### Common Issues
- **Environment Variables**: Ensure all required variables (`JWT_SECRET`, `TOKEN_LENGTH`, etc.) are set correctly. Missing variables will cause the application to fail on startup.
- **Google API Authentication**: Verify that Google OAuth credentials and client IDs are correct if authentication fails.
- **Database Connection**: Check Prisma configuration and database connection strings if database operations fail.

### Maintenance
- Monitor cron jobs for scheduled tasks like token cleanup (`delete-expired-tokens-job.ts`).
- Regularly update dependencies to address security vulnerabilities.
- Use Prisma migrations to manage database schema changes:
  ```
  npx prisma migrate dev --name "description"
  ```

## Additional Notes
This documentation aims to provide a comprehensive guide to the CatsHelp server-side implementation. For further details on specific components or to implement the proposed directory restructuring, refer to the project maintainers or relevant code files.




npm run typeorm migration:run
npm run create-migration database/migrations/test