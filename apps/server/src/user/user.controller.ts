import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import {
    Controller,
    Get,
    NotFoundException, Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from '@user/user.service';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(AuthorizationGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get()
    async getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Get("me")
    async getCurrentUser(@Req() req: Request): Promise<User> {
        const user = req.user;

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }


    @Get(":id")
    async getUser(@Req() req: Request, @Param("id") id: string): Promise<User> {
        const user = req.user;
        if (user.id !== Number(id) && user.role !== "ADMIN"){
            throw new Error('Unauthorized');
        }

        return this.userService.getUser(id);
    }

}
