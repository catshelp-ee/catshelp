import { Animal } from '@animal/entities/animal.entity';
import { Rescue } from '@animal/entities/rescue.entity';
import { Injectable } from '@nestjs/common';
import { UpdateAnimalDto } from '@server/src/animal/dto/update-animal.dto';
import { FosterHome } from '@user/entities/foster-home.entity';
import { DataSource, Repository } from 'typeorm';
import { AnimalRescueDto } from '../dto/create-animal.dto';
import { RescueResult } from '../interfaces/rescue-result';

@Injectable()
export class AnimalRepository extends Repository<Animal> {
  constructor(private dataSource: DataSource) {
    super(Animal, dataSource.createEntityManager());
  }

  /** Get animals by user ID */
  async getAnimalsByUserId(userId: number): Promise<Animal[]> {
    const userFosterHome = await this.dataSource
      .getRepository(FosterHome)
      .findOne({
        where: { user: { id: userId } },
        relations: ['animals', 'animals.animalRescues'],
      });

    return userFosterHome?.animals ?? [];
  }

  /** Get animal by ID including rescue info */
  async getAnimalByIdWithRescue(id: number): Promise<Animal | null> {
    return this.findOne({
      where: { id },
      relations: ['animalToAnimalRescues', 'animalToAnimalRescues.animalRescue'],
    });
  }

  /** Create animal and associated rescue in a transaction */
  async createAnimalWithRescue(data: AnimalRescueDto,): Promise<RescueResult> {
    return this.dataSource.transaction(async (manager) => {
      const animal = manager.create(Animal, {});
      await manager.save(animal);

      const rescue = manager.create(Rescue, {
        rescueDate: data.date,
        state: data.state,
        address: data.location,
        locationNotes: data.notes,
      });
      await manager.save(rescue);

      rescue.animal = animal;
      await manager.save(rescue);

      return { animal, rescue };
    });
  }

  /** Get animal by Rescue ID */
  async getAnimalByAnimalRescueId(animalRescueId: number): Promise<Animal | null> {
    return this.createQueryBuilder('animal')
      .innerJoin('animal.animalToAnimalRescues', 'link')
      .where('link.animalRescueId = :animalRescueId', { animalRescueId })
      .getOne();
  }

  /** Update basic animal profile */
  async updateEditProfile(data: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne({ where: { id: Number(data.animalId) } });
    if (!animal) throw new Error('Animal not found');

    animal.profileTitle = data.title;
    animal.description = data.description;

    return this.save(animal);
  }

  /** Save or update animal */
  async saveOrUpdateAnimal(data: Partial<Animal>): Promise<Animal> {

    if (data.id) {
      const animal = (await this.findOne({ where: { id: data.id } }))!;
      Object.assign(animal, data);
      return this.save(animal);
    }

    const animal = this.create(data);

    return this.save(animal);
  }

  /** Delete animal by ID */
  async deleteAnimalById(id: number): Promise<void> {
    await this.delete({ id });
  }
}
