import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import {
    Body,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import type { Request } from 'express';
import { AnimalService } from './animal.service';

@Controller('animals')
@UseGuards(AuthorizationGuard)
export class AddRescueController {
    constructor(
        private readonly animalService: AnimalService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async postAnimal(@Req() req: Request, @Body() body: any) {
        const user = req.user;

        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('You do not have permission to add rescues.');
        }

        const newAnimal = await this.animalService.createAnimal(body, user);
        return { id: newAnimal.animal.id };
    }
}
