# Cat Shelter Management App

A React + TypeScript + Vite application for managing cat shelter operations with authentication, database management, and Google integrations.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js with Inversify DI
- **Database**: MariaDB with Prisma ORM
- **Authentication**: JWT + Google OAuth
- **Analytics**: PostHog
- **Integrations**: Google Sheets, Google Drive, SMTP

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   ```
   Then fill in your `.env` file using the guide below.

3. **Set up database:**
   - Create a MySQL/MariaDB database (Docker Compose script provided in `/scripts`)
   - Generate Prisma client and apply schema:
     ```bash
     cd prisma/
     npx prisma generate
     npx prisma db push  # or npx prisma migrate dev for local
     ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Configuration

Copy `.env.example` to `.env` and configure the following sections:

### Application Configuration

```bash
# Environment: "PROD" OR "TEST"
VITE_ENVIRONMENT="TEST"

# PostHog analytics (optional for development)
VITE_PUBLIC_POSTHOG_KEY=phc_1234567890abcdef1234567890abcdef12345678
VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Setting up PostHog Analytics:**

PostHog is used for user analytics and feature flags. It's optional for development but recommended for production.

1. **Create PostHog Account:**
   - Go to [PostHog.com](https://posthog.com/)
   - Click "Get started - free" 
   - Sign up with email or GitHub

2. **Create a Project:**
   - After signup, you'll be prompted to create your first project
   - Enter your project name (e.g., "Cat Shelter App")
   - Select your use case (e.g., "Product Analytics")

3. **Get Project Key and Host:**
   - After project creation, you'll see the setup page
   - Copy the **Project API Key** (starts with `phc_`)
   - The **Host URL** is typically `https://app.posthog.com` for PostHog Cloud

4. **Configure your .env:**
   ```bash
   VITE_PUBLIC_POSTHOG_KEY=phc_your_actual_project_key_here
   VITE_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

**For Development:**
You can leave these empty during development:
```bash
VITE_PUBLIC_POSTHOG_KEY=
VITE_PUBLIC_POSTHOG_HOST=
```

### Server Configuration

```bash
BACKEND_PORT="8081"
VITE_BACKEND_URL="http://localhost:8081"
VITE_FRONTEND_PORT="5173"
VITE_FRONTEND_URL="http://localhost:5173"
```

### Authentication & Security

```bash
# Generate a secure random string for JWT signing
JWT_SECRET=your_super_secret_jwt_key_here
JWT_TOKEN_EXPIRY="1h"

# Google OAuth Client ID (get from Google Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Understanding JWT Secret:**

JWT (JSON Web Token) is used for user authentication. The JWT_SECRET is a cryptographic key used to sign and verify these tokens.

**Generating a Secure JWT Secret:**

Option 1 - Command Line (recommended):
```bash
openssl rand -hex 32
```

Option 2 - Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Security Requirements:**
- Must be at least 32 characters long
- Should be completely random
- Never share or commit to version control
- Use different secrets for different environments

**To get Google Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure OAuth consent screen if prompted
6. Copy the Client ID
7. Download the credentials and place in root folder

### Database Configuration

```bash
# MySQL database connection
DATABASE_URL="mysql://root:root@localhost:3306/chdb"

# Google Sheets integration
CATS_DATABASE_SHEETS_ID=1ABC123DEF456GHI789JKL
CATS_DATABASE_TABLE_NAME=Cats
ADOPTION_CONTRACT_SHEETS_ID=2XYZ789ABC123DEF456GHI

# Google Drive integration
GOOGLE_DRIVE_ID=your_drive_folder_id
GOOGLE_DRIVE_PARENT_FOLDER=parent_folder_id

# Path to Google service account credentials JSON file
GOOGLE_CREDENTIALS_PATH=/path/to/your/service-account-key.json
```

**To set up Google Sheets/Drive:**
1. Create a Google Cloud project
2. Enable Google Sheets API and Google Drive API
3. Create a service account
4. Download the service account JSON key
5. Share your Google Sheets and Drive folders with the service account email
6. Copy the folder/sheet IDs from the URLs

### Email Configuration

```bash
# SMTP settings for sending emails
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your_16_character_app_password

# Sender address for magic link emails
MAGIC_LINK_FROM_EMAIL="noreply@yourdomain.com"
```

**Setting up Gmail App Password:**

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click "Security" → "2-Step Verification"
   - Follow the setup process

2. **Generate App Password:**
   - In Security settings, click "App passwords"
   - Select "Mail" and "Other (custom name)"
   - Enter a name like "Cat Shelter App"
   - Copy the 16-character password

3. **Configure your .env:**
   ```bash
   SMTP_EMAIL=your-gmail-address@gmail.com
   SMTP_PASSWORD=abcdefghijklmnop  # Remove spaces from app password
   ```

### Redirect URLs

```bash
# Medical information redirects
DEWORMING_REDIRECT_URL=https://yourdomain.com/deworming-info
VACCINATION_REDIRECT_URL=https://yourdomain.com/vaccination-info
RABIES_VACCINATION_REDIRECT_URL=https://yourdomain.com/rabies-info

# General redirects
NO_CAT_AVAILABLE_REDIRECT="https://www.catshelp.ee/kassitoa-kassid"
MISSING_PROFILE_INFO_REDIRECT="/cat-profile"
```

## Database Setup with Prisma

This project uses Prisma ORM for database management.

### Basic Prisma Commands

**Generate Prisma Client:**
```bash
npx prisma generate
```
- Run after any changes to `schema.prisma`
- Required before you can use Prisma in your code

**Database Push (Development & Cloud Databases):**
```bash
npx prisma db push
```
- Pushes schema changes directly to database
- **Required for cloud database providers**
- Good for prototyping and development

**Database Migration (Local/Self-hosted only):**
```bash
npx prisma migrate dev --name your_migration_name
```
- Creates and applies a new migration
- Generates SQL migration files
- **Note**: Won't work with cloud database providers

**View Database:**
```bash
npx prisma studio
```

### Initial Database Setup

1. Create your MySQL/MariaDB database (Docker Compose script in `/scripts`)
2. Configure `DATABASE_URL` in your `.env` file
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Apply schema to database:
   ```bash
   # For development or cloud databases
   npx prisma db push
   
   # OR for local with migration tracking
   npx prisma migrate dev --name init
   ```

### Important: Cloud Database Limitations

**If using cloud databases** you **must use `db push`**:

```bash
# ✅ Works with cloud databases
npx prisma db push

# ❌ Will fail with cloud databases
npx prisma migrate dev
```

Cloud providers don't allow the "shadow database" that migrations require.

## Development with Inversify DI

This project uses Inversify for Dependency Injection (DI).

### Adding a New Service

1. **Create the class:**
```typescript
// services/EmailService.ts
import { injectable } from 'inversify';

@injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Implementation here
  }
}
```

2. **Create the type for DI**
```typescript
// types/inversify-types.ts
const TYPES = {
    ...,
    EmailService: Symbol.for('EmailService'),
    ...,
}
```

3. **Bind to container:**
```typescript
// container.ts
  container
    .bind<EmailService>(TYPES.EmailService)
    .to(EmailService)
    .inSingletonScope();
```

### Adding a New Controller

```typescript
// controllers/UserController.ts
import { injectable, inject } from 'inversify';
import TYPES from 'types/inversify-types';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.EmailService) private emailService: EmailService
  ) {}

  async registerUser(userData: any): Promise<void> {
    await this.emailService.sendEmail(userData.email, 'Welcome!', 'Hello');
  }
}
```

### Best Practices

- Always use `@injectable()` decorator on classes
- Create interfaces for better testability
- Keep container bindings organized in one place
- Use consistent naming for injection identifiers

## Development Workflow

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Frontend only (for debugging):**
```bash
npm run dev:vite
```

**Production build:**
```bash
npm run build
```

### Debugging

1. Create debug configuration in your IDE
2. Run frontend with `npm run dev:vite`
3. Start your debugger

### Database Changes

1. Modify `prisma/schema.prisma`
2. Generate client: `npx prisma generate`
3. Apply changes: `npx prisma db push`
4. Commit schema changes to git

## Deployment

The application automatically deploys to Zone via GitHub pipeline when changes are pushed to the main branch.

## Troubleshooting

**Common Issues:**

- **Port conflicts**: Change `BACKEND_PORT` and `VITE_FRONTEND_PORT` in `.env`
- **Database connection fails**: Verify MySQL is running and credentials are correct
- **Prisma Client not generated**: Run `npx prisma generate` after schema changes
- **Migration errors**: Use `npx prisma db push` for cloud databases
- **Google APIs not working**: Ensure APIs are enabled and service account has permissions
- **Email not sending**: Check SMTP credentials and Gmail app password setup
- **Inversify injection errors**: Ensure all classes have `@injectable()` and are bound to container
