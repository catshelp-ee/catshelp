import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Body, Controller, HttpCode, Put, UseGuards } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { UpdateAnimalDto } from './dto/update-animal.dto';

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
}
