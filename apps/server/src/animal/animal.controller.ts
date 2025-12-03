import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Req, Body, Controller, HttpCode, Put, Post, UseGuards } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import type { AnimalRescueDto } from './dto/create-animal.dto';
import type { Request } from 'express';

@Controller('animals')
@UseGuards(AuthorizationGuard)
export class AnimalController {
    constructor(
        private readonly animalService: AnimalService
    ) { }

    @Put()
    @HttpCode(204)
    async updateAnimal(@Body() updateAnimalData: UpdateAnimalDto) {
        await this.animalService.updateAnimal(updateAnimalData);
    }

    @Post()
    @HttpCode(204)
    async saveAnimal(@Req() req: Request, @Body() animalData: AnimalRescueDto) {
        const user = req.user;
        await this.animalService.createAnimal(animalData, user);
    }
}
