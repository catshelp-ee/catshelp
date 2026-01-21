import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Body, Controller, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AnimalService } from './animal.service';
import type { AnimalRescueDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import {ProfileBuilder} from "@animal/profile-builder.service";
import {DashboardService} from "@dashboard/dashboard.service";
import {NotificationService} from "@notification/notification.service";
import {AuthService} from "@auth/auth.service";

@Controller('animals')
@UseGuards(AuthorizationGuard)
export class AnimalController {
    constructor(
        private readonly animalService: AnimalService,
        private readonly catProfileBuilder: ProfileBuilder,
        private readonly dashboardService: DashboardService,
        private readonly notificationService: NotificationService,
    ) { }

    @Get(":id/profile")
    async getProfile(@Req() req: Request, @Param("id") id: string) {
        const user = req.user;
        if (user.id !== Number(id) && user.role !== "ADMIN"){
            throw new Error('Unauthorized');
        }

        const animal = await this.animalService.getAnimalById(id);

        if (!animal){
            throw new Error("No animal found");
        }

        const profile = await this.catProfileBuilder.buildProfile(animal);

        return profile;
    }

    @Get(":id/avatars")
    async getAvatars(@Req() req: Request, @Param("id") id: string) {
        if (!AuthService.checkIfAdmin(req, id)){
            throw new Error('Unauthorized');
        }

        const animals = await this.animalService.getAnimalsByUserId(id);
        return this.dashboardService.getAvatars(animals);
    }

    @Get(":id/todos")
    async getTodos(@Req() req: Request, @Param("id") id: string) {
        if (!AuthService.checkIfAdmin(req, id)){
            throw new Error('Unauthorized');
        }

        const animals = await this.animalService.getAnimalsByUserId(id);
        return this.notificationService.processNotifications(animals);
    }

    @Put()
    @HttpCode(204)
    async updateAnimal(@Body() updateAnimalData: UpdateAnimalDto) {
        await this.animalService.updateAnimal(updateAnimalData);
    }

    @Post()
    @HttpCode(201)
    async saveAnimal(@Req() req: Request, @Body() animalData: AnimalRescueDto) {
        const user = req.user;
        const data = await this.animalService.createAnimal(animalData, user);
        return data.animal.id;
    }
}
