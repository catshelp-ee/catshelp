// src/admin/admin.controller.ts
import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminService } from './admin.service';

class RunCronJobDto {
    jobName: string;
}

@Controller('admin')
@UseGuards(AuthorizationGuard)
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @Post('run-cron-job')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async runCronJob(@Req() req: Request, @Body() body: RunCronJobDto) {
        const user = req.user;

        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can run cron jobs.');
        }

        await this.adminService.runJob(body.jobName);
        return { status: 'success' };
    }
}
