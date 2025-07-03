# CatsHelp Server-Side Documentation

## Introduction
This document provides an overview of the server-side (backend) implementation for the CatsHelp application, a system likely focused on pet management or rescue operations. The backend is built using **Node.js** with **Express.js** for routing, **TypeScript** for type safety, **Prisma ORM** for database interactions, and **Inversify** for dependency injection to ensure modularity and testability.

## Architectural Overview
The CatsHelp backend follows a modular architecture with a clear separation of concerns:
- **Controllers**: Handle HTTP requests and responses, mapping to specific endpoints.
- **Services**: Encapsulate business logic, such as data processing and external API interactions.
- **Repositories**: Manage data access and database operations.
- **Middleware**: Process requests for authentication, caching, error handling, and file storage.
- **Cron Jobs**: Handle scheduled background tasks.

The application uses **Inversify** for dependency injection, configured in `container.ts`, to manage dependencies across components. The bootstrap process in `main.ts` initializes the Express app, sets up middleware, defines routes, and starts cron jobs for background operations.

## Key Components
### Controllers
Controllers manage HTTP endpoints:
- **DashboardController**: Retrieves dashboard data for users, including pet information.
- **LoginController**: Handles user authentication via Google OAuth and email login.
- **ProfileController**: Manages pet profile data retrieval.
- **UserController**: Provides endpoints for user data access.

### Services
Services handle business logic:
- **DashboardService**: Interacts with Google Sheets to fetch pet data and notifications, manages image downloads for pet profiles.
- **AuthService**: Manages authentication, including Google token verification and JWT generation/verification.

### Repositories
Repositories handle database operations:
- **AnimalRepository**: Manages animal data, including creation with rescue information and updates to rescue records.

### Middleware
Middleware processes requests:
- Authentication (`authorization-middleware.ts`): Ensures secure access to endpoints.
- Caching (`caching-middleware.ts`): Optimizes performance by caching responses.
- Error Handling (`error-middleware.ts`): Centralizes error management.
- File Storage (`storage-middleware.ts`): Handles file uploads, such as images.

### Cron Jobs
Scheduled tasks are managed by `CronRunner` in `cron/cron-runner.ts`, handling background operations like cleaning up expired tokens.

## Directory Structure
### Current Structure
The current organization of the server directory is as follows:
```
server/
├── main.ts
├── container.ts
├── express-async-errors.ts
├── controllers/
│   ├── animal-controller.ts
│   ├── dashboard-controller.ts
│   ├── file-controller.ts
│   ├── login-controller.ts
│   ├── profile-controller.ts
│   └── user-controller.ts
├── cron/
|   ├── jobs/
│   └── cron-runner.ts
├── middleware/
│   ├── authorization-middleware.ts
│   ├── caching-middleware.ts
│   ├── error-middleware.ts
│   └── storage-middleware.ts
├── package.json
├── pm2.config.js
├── prisma.ts
├── repositories/
│   └── animal-repository.ts
└── services/
    ├── animal/
    ├── auth/
    ├── cache/
    ├── dashboard/
    ├── files/
    ├── google/
    ├── notifications/
    ├── profile/
    └── user/
```

### Proposed Structure (**IGNORE**)
To improve clarity and scalability, a restructured directory is proposed:
```
server/
├── api/
│   └── controllers/
│       ├── dashboard-controller.ts
│       ├── login-controller.ts
│       ├── profile-controller.ts
│       └── user-controller.ts
├── core/
│   ├── services/
│   │   ├── animal/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── profile/
│   └── repositories/
│       └── animal-repository.ts
├── config/
│   ├── container.ts
│   └── prisma.ts
├── middleware/
│   ├── authorization-middleware.ts
│   ├── caching-middleware.ts
│   ├── error-middleware.ts
│   └── storage-middleware.ts
├── jobs/
│   └── cron-runner.ts
├── main.ts
├── package.json
└── pm2.config.js
```
**Rationale**: Grouping controllers under `api` clarifies their role in handling HTTP endpoints. Services and repositories are grouped under `core` to emphasize business logic and data access. Configuration files are moved to `config` for separation, and cron jobs are renamed to `jobs` for consistency with common naming conventions.

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
