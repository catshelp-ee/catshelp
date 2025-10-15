import { Animal } from '@animal/entities/animal.entity';
import { AvatarData } from '@animal/interfaces/avatar';
import { FileRepository } from '@file/file.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(
    private readonly fileRepository: FileRepository
  ) { }

  public async getAvatars(animals: Animal[]): Promise<AvatarData[]> {
    const data: AvatarData[] = [];
    for (let index = 0; index < animals.length; index++) {
      const animal = animals[index];
      const profilePicture = await this.fileRepository.getProfilePicture(animal.id);

      const pathToImage = profilePicture ? `images/${profilePicture.uuid}.jpg` : "missing64x64.png";

      data.push({
        name: animal.name,
        pathToImage,
      });
    }

    return data;
  }
}
