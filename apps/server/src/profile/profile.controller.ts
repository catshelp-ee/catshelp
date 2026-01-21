// src/profile/profile.controller.ts
import { AnimalService } from '@animal/animal.service';
import { ProfileBuilder } from '@animal/profile-builder.service';
import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import type { Request } from 'express';
import { DashboardService } from '../dashboard/dashboard.service';


@Controller('profile')
@UseGuards(AuthorizationGuard)
export class ProfileController {
    constructor(
        private readonly animalService: AnimalService,
        private readonly catProfileBuilder: ProfileBuilder,
        private readonly dashboardService: DashboardService,
    ) { }

    @Get()
    async getProfiles(@Req() req: Request) {
        // Assuming the AuthGuard attaches `req.user`
        const user = req.user;

        const animals = await this.animalService.getAnimalsByUserId(user.id);
        const profiles = await this.dashboardService.getAvatars(animals);

        return { profiles };
    }
}
