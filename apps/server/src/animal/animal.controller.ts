import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Body, Controller, HttpCode, Post, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AnimalService } from './animal.service';
import type { AnimalRescueDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { UpdateProfilePictureDTO } from './dto/update-profile-picture-dto';

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

    @Put("/profile-picture")
    @HttpCode(204)
    async setProfilePicture(@Body() updateProfilePictureDTO: UpdateProfilePictureDTO) {
        await this.animalService.setAsProfilePicture(updateProfilePictureDTO);
    }

    @Post()
    @HttpCode(201)
    async saveAnimal(@Req() req: Request, @Body() animalData: AnimalRescueDto) {
        const user = req.user;
        const data = await this.animalService.createAnimal(animalData, user);
        return data.animal.id;
    }
}
