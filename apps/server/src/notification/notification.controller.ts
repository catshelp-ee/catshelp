// src/notifications/notification.controller.ts
import { EmailService } from '@auth/email.service';
import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('notifications')
@UseGuards(AuthorizationGuard)
export class NotificationController {
    constructor(
        private readonly emailService: EmailService
    ) { }

    @Post('email')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: path.join(process.cwd(), 'images'),
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const ext = path.extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async sendNotificationToVolunteers(
        @UploadedFiles() images: Express.Multer.File[],
        @Body() data: any,
    ) {
        await this.emailService.sendNotificationToVolunteers(images, data);
        return { status: 'success' };
    }
}
