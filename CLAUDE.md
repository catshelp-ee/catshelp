# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Catshelp is a cat shelter management system built with React frontend and Deno backend. The application helps manage cat profiles, foster homes, and adoption processes.

## Development Commands

### Common Development Tasks
- `deno task dev` - Start both frontend and backend in development mode
- `deno task dev:vite` - Start only the frontend (Vite dev server)
- `deno task dev:api` - Start only the backend API server
- `deno task build` - Build the application for production
- `deno task serve` - Build and serve the application
- `deno task lint` - Run TypeScript compilation check and ESLint on entire codebase
- `deno task lint:check` - Same as deno task lint
- `deno task lint:fix` - Run ESLint with --fix to auto-fix issues
- `deno install` - Install dependencies

### Database Operations
- `npx sequelize-cli db:migrate` - Run database migrations
- Database uses MariaDB with Sequelize ORM
- Models are in `/models/` directory with `.cjs` extension

### Development Setup
1. Install Deno
2. Run `deno install` to install dependencies
3. Create `.env` file based on `.env.example`
4. Create `config/config.json` based on `config/config.json.example`
5. Set up MariaDB database
6. Run database migrations
7. Start development with `deno task dev`

## Version Control

### Merge Request Guidelines
- Development uses merge requests
- Use conventional commit messages

## Architecture

### Frontend (React + TypeScript)
- **Entry Point**: `src/main.tsx` - Sets up providers and renders App
- **Router**: `src/App.tsx` - Main routing configuration with protected routes
- **Layout**: `src/pages/App/PageLayout.tsx` - Common layout wrapper
- **Key Pages**:
  - `src/pages/Dashboard/` - Main dashboard with pet management
  - `src/pages/CatProfile/` - Cat profile viewing and editing
  - `src/pages/AddCat/` - New cat registration form
  - `src/pages/EditCat/` - Multi-step cat editing form
  - `src/pages/Login/` - Authentication (Google OAuth + email)

### Backend (Deno + Express)
- **Entry Point**: `server/main.ts` - Express server setup with middleware
- **Controllers**: `server/controllers/` - HTTP request handlers
- **Services**: `server/services/` - Business logic layer
- **Models**: `models/` - Sequelize database models (CommonJS)
- **Middleware**: `server/middleware/` - Auth and error handling
- **Cron Jobs**: `server/cron/` - Scheduled tasks

### Key Features
- Google OAuth authentication with JWT tokens
- Multi-step cat profile forms with image uploads
- Dashboard with notification system
- Foster home management
- AI-generated cat descriptions
- Mobile responsive design with separate mobile/desktop views

### Path Aliases (configured in deno.json)
- `@/` → `./src/`
- `@analytics/` → `./src/analytics/`
- `@assets/` → `./src/assets/`
- `@context/` → `./src/context/`
- `@pages/` → `./src/pages/`
- `@style/` → `./src/style/`
- `@models/` → `./src/types/`
- `@utils/` → `./src/utils/`
- `@hooks/` → `./src/hooks/`

### Environment Configuration
- Frontend runs on port 5173 (configurable via VITE_FRONTEND_PORT)
- Backend runs on port 8081 (configurable via BACKEND_PORT)
- API proxy configured in vite.config.ts for `/api` routes
- Database configuration in `config/config.json`

### UI Framework
- Material-UI (MUI) for components
- Tailwind CSS for styling
- Responsive design with mobile-first approach
- PostHog for analytics

### File Upload
- Multer configured for image uploads
- Files stored in `public/Temp/` directory
- 10MB file size limit, images only

## Testing and Linting
- TypeScript compilation via `tsc --noEmit`
- ESLint for code quality
- No specific test framework configured - check for test files before assuming framework

### Linting Workflow for Changed Files
When working on specific files and you want to lint only those files, follow this workflow:

1. **Create a temporary lint:new task** in `deno.json` under the `tasks` section:
   ```json
   "lint:new": "tsc --noEmit && eslint path/to/file1.ts path/to/file2.tsx"
   ```

2. **Run the temporary task:**
   ```bash
   deno task lint:new
   ```

3. **Remove the temporary task** from `deno.json` after use to keep the configuration clean.

**Example for typical development:**
```json
"lint:new": "tsc --noEmit && eslint src/services/wixService.ts src/pages/CatProfile/EditProfile.tsx src/pages/CatProfile/Form/ActionButtons.tsx"
```

### Alternative npm commands:
- `npm run lint` - Run TypeScript compilation check and ESLint (same as deno task lint)
- `npm run dev` - Start development servers
- `npm run build` - Build the application

Note: The project supports both Deno tasks and npm scripts. Deno tasks are preferred for development.