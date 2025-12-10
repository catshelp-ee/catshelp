import { AnimalService } from '@animal/animal.service';
import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from '@notification/notification.service';
import type { Request } from 'express';
import { DashboardService } from './dashboard.service';



@Controller('dashboard')
@UseGuards(AuthorizationGuard)
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
        private readonly animalService: AnimalService,
        private readonly notificationService: NotificationService,
    ) { }

    @Get()
    async getDashboard(@Req() req: Request) {
        // Assuming your AuthGuard attaches user info to req.user
        const userID = req.user.id;

        const animals = await this.animalService.getAnimalsByUserId(userID);
        const todos = await this.notificationService.processNotifications(animals);
        const pets = await this.dashboardService.getAvatars(animals);

        return { todos, pets };
    }
}
