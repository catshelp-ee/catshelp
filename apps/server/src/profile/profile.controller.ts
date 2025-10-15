// src/profile/profile.controller.ts
import { AnimalService } from '@animal/animal.service';
import { ProfileBuilder } from '@animal/profile-builder.service';
import { AuthorizationGuard } from '@common/middleware/authorization.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';


@Controller('profile')
@UseGuards(AuthorizationGuard)
export class ProfileController {
  constructor(
    private readonly animalService: AnimalService,
    private readonly catProfileBuilder: ProfileBuilder,
  ) { }

  @Get()
  async getProfile(@Req() req: Request) {
    // Assuming the AuthGuard attaches `req.user`
    const user = req.user;

    const animals = await this.animalService.getAnimalsByUserId(user.id);
    const profiles = await this.catProfileBuilder.buildProfiles(animals);

    return { profiles };
  }
}
