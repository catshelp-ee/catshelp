import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import {
    Controller,
    Get,
    NotFoundException,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { User } from './entities/user.entity';

@Controller('user')
@UseGuards(AuthorizationGuard)
export class UserController {
    constructor(
    ) { }

    @Get()
    async getCurrentUser(@Req() req: Request): Promise<User> {
        const user = req.user;

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
