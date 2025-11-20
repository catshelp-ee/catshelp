import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import "reflect-metadata";
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';


function setNodeExceptionHandlers() {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Promise Rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
    });
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    setNodeExceptionHandlers();

    // Enable CORS (only needed if frontend is on different domain)
    app.enableCors({
        origin: process.env.VITE_FRONTEND_URL || true,
        credentials: true,
    });

    app.use(cookieParser());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('api');

    // Serve static files from build/client
    const clientPath = join(__dirname, '../client');
    app.useStaticAssets(clientPath);

    // Handle client-side routing (SPA fallback)
    app.use((req, res, next) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(join(clientPath, 'index.html'));
        } else {
            next();
        }
    });

    const port = process.env.BACKEND_PORT || 3000;
    await app.listen(port, '0.0.0.0'); // <--- important
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📦 Serving frontend from: ${clientPath}`);
}
bootstrap();
