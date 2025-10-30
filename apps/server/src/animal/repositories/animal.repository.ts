import { Animal } from '@animal/entities/animal.entity';
import { Rescue } from '@animal/entities/rescue.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UpdateAnimalDto } from '@server/src/animal/dto/update-animal.dto';
import { BaseRepository } from '@server/src/common/base.repository';
import { FosterHome } from '@user/entities/foster-home.entity';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { AnimalRescueDto } from '../dto/create-animal.dto';
import { RescueResult } from '../interfaces/rescue-result';


@Injectable({ scope: Scope.REQUEST })
export class AnimalRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }


  public save(animal: Partial<Animal>) {
    return this.getRepository(Animal).save(animal);
  }


  public getAnimalById(id: number | string) {
    return this.getRepository(Animal).findOne({
      where: { id: Number(id) }
    });
  }

  /** Get animals by user ID */
  async getAnimalsByUserId(userId: number): Promise<Animal[]> {
    const userFosterHome = await this.getRepository(FosterHome)
      .findOne({
        where: { user: { id: userId } },
        relations: ['animals', 'animals.animalRescues'],
      });

    return userFosterHome?.animalToFosterHome.map(rel => rel.animal).filter(Boolean) ?? [];
  }

  /** Get animal by ID including rescue info */
  async getAnimalByIdWithRescue(id: number): Promise<Animal | null> {
    return this.getRepository(Animal).findOne({
      where: { id },
      relations: ['animalToAnimalRescues', 'animalToAnimalRescues.animalRescue'],
    });
  }

  /** Create animal and associated rescue in a transaction */
  async createAnimalWithRescue(data: AnimalRescueDto,): Promise<RescueResult> {
    const animal = this.getRepository(Animal).create();
    await this.getRepository(Animal).save(animal);

    const rescue = this.getRepository(Rescue).create({
      rescueDate: data.date,
      state: data.state,
      address: data.location,
      locationNotes: data.notes,
    });

    rescue.animal = animal;
    await this.getRepository(Rescue).save(rescue);

    return { animal, rescue };
  }

  /** Get animal by Rescue ID */
  async getAnimalByAnimalRescueId(animalRescueId: number): Promise<Animal | null> {
    return this.getRepository(Animal).createQueryBuilder('animal')
      .innerJoin('animal.animalToAnimalRescues', 'link')
      .where('link.animalRescueId = :animalRescueId', { animalRescueId })
      .getOne();
  }

  /** Update basic animal profile */
  async updateEditProfile(data: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.getRepository(Animal).findOne({ where: { id: Number(data.animalId) } });
    if (!animal) throw new Error('Animal not found');

    animal.profileTitle = data.title;
    animal.description = data.description;

    return this.getRepository(Animal).save(animal);
  }

  /** Save or update animal */
  async saveOrUpdateAnimal(data: Partial<Animal>): Promise<Animal> {

    if (data.id) {
      const animal = (await this.getRepository(Animal).findOne({ where: { id: data.id } }))!;
      Object.assign(animal, data);
      return this.getRepository(Animal).save(animal);
    }

    const animal = this.getRepository(Animal).create(data);

    return this.getRepository(Animal).save(animal);
  }

  /** Delete animal by ID */
  async deleteAnimalById(id: number): Promise<void> {
    await this.getRepository(Animal).delete({ id });
  }
}
