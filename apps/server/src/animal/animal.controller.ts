import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Body, Controller, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AnimalService } from './animal.service';
import type { AnimalRescueDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalTodoDto } from "@animal/dto/animal-todo.dto";

@Controller('animals')
@UseGuards(AuthorizationGuard)
export class AnimalController {
    constructor(
        private readonly animalService: AnimalService
    ) { }

    @Get(":userId/profiles")
    async getProfiles(@Req() req: Request, @Param('userId') userId: string) {
        const user = req.user;
        if (user.id !== Number(userId) && user.role !== "ADMIN"){
            throw new Error('Unauthorized');
        }
        const animals = await this.animalService.getAnimalsByUserId(userId);
        const profiles = await this.animalService.getAnimalSummaries(animals);

        return { profiles };
    }

    @Get(":id/profile-picture")
    async getProfilePicture(@Req() req: Request, @Param("id") id: string) {
        return this.animalService.getProfilePicture(id);
    }

    @Get(":animalId/todos")
    async getAnimalTodos(@Req() req: Request, @Param("animalId") id: string): Promise<AnimalTodoDto[]> {
        const user = req.user;
        if (user.role !== "ADMIN"){
            throw new Error('Unauthorized');
        }

        const animals = await this.animalService.getAnimalById(id);
        return this.animalService.getNotifications(animals);
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
