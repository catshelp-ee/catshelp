import { Animal } from '@animal/entities/animal.entity';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UpdateAnimalDto } from '@server/src/animal/dto/update-animal.dto';
import { BaseRepository } from '@server/src/common/base.repository';
import { FosterHome } from '@user/entities/foster-home.entity';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AnimalRepository extends BaseRepository<Animal> {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(Animal, dataSource, request);
    }

    public getAnimalById(id: number | string) {
        return this.findOne({
            where: { id: Number(id) }
        });
    }

    /** Get animals by user ID */
    public async getAnimalsByUserId(userId: number): Promise<Animal[]> {
        const userFosterHome = await this.dataSource
            .getRepository(FosterHome)
            .findOne({
                where: { user: { id: userId } },
                relations: ['animals', 'animals.animalRescues'],
            });

        return userFosterHome?.animalToFosterHome.map(rel => rel.animal).filter(Boolean) ?? [];
    }

    /** Get animal by ID including rescue info */
    public async getAnimalByIdWithRescue(id: number): Promise<Animal | null> {
        return this.findOne({
            where: { id },
            relations: ['animalToAnimalRescues', 'animalToAnimalRescues.animalRescue'],
        });
    }

    /** Get animal by Rescue ID */
    public async getAnimalByAnimalRescueId(animalRescueId: number): Promise<Animal | null> {
        return this.createQueryBuilder('animal')
            .innerJoin('animal.animalToAnimalRescues', 'link')
            .where('link.animalRescueId = :animalRescueId', { animalRescueId })
            .getOne();
    }

    /** Update basic animal profile */
    public async updateEditProfile(data: UpdateAnimalDto): Promise<Animal> {
        const animal = await this.findOne({ where: { id: Number(data.animalId) } });
        if (!animal) throw new Error('Animal not found');

        animal.profileTitle = data.title;
        animal.description = data.description;

        return this.save(animal);
    }

    /** Save or update animal */
    public async saveOrUpdateAnimal(data: Partial<Animal>): Promise<Animal> {
        if (data.id) {
            const animal = (await this.findOne({ where: { id: data.id } }))!;
            Object.assign(animal, data);
            return this.save(animal);
        }

        const animal = this.create(data);
        return this.save(animal);
    }

    /** Delete animal by ID */
    public async deleteAnimalById(id: number): Promise<void> {
        await this.delete({ id });
    }
}
