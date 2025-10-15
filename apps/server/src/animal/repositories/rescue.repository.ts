import { Rescue } from '@animal/entities/rescue.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RescueRepository extends Repository<Rescue> {
  constructor(private dataSource: DataSource) {
    super(Rescue, dataSource.createEntityManager());
  }

  async getAnimalRescueByAnimalId(animalId: number): Promise<Rescue | null> {
    return this.findOne({
      where: {
        animal: { id: animalId },
      },
      relations: ['animalToAnimalRescues', 'animalToAnimalRescues.animal'],
    });
  }

  async getAnimalRescueByRankNr(rankNr: string): Promise<Rescue | null> {
    return this.findOne({ where: { rankNr } });
  }

  async saveOrUpdateAnimalRescue(data: {
    rankNr: string;
    rescueDate: Date;
    address: string;
  }): Promise<Rescue> {
    const existing = await this.findOne({ where: { rankNr: data.rankNr } });

    if (existing) {
      Object.assign(existing, data);
      return this.save(existing);
    }

    const newRescue = this.create(data);
    return this.save(newRescue);
  }


  async deleteAnimalRescueById(id: number) {
    return this.delete({ id });
  }

}
