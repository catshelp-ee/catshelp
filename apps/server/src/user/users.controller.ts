import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import {
    Controller,
    Get,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from '@user/user.service';
import { User } from './entities/user.entity';
import {AnimalSummaryDto} from "@animal/dto/animal-summary.dto";
import {AuthService} from "@auth/auth.service";

@Controller('users')
@UseGuards(AuthorizationGuard)
export class UsersController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get()
    async getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Get(':userId/animals')
    public async getAnimalsForUser(@Req() req: Request, @Param('userId') userId: string): Promise<AnimalSummaryDto[]> {
        if (!AuthService.checkIfAdmin(req, userId)){
            throw new Error('Unauthorized');
        }

        return this.userService.getAnimals(userId);
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
