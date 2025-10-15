import { Treatment } from '@animal/entities/treatment.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TreatmentRepository extends Repository<Treatment> {
  constructor(private dataSource: DataSource) {
    super(Treatment, dataSource.createEntityManager());
  }

  /** Get the full treatment history for an animal, including treatment details */
  async getTreatements(animalId: number): Promise<Treatment[]> {
    return this.find({
      where: { animal: { id: animalId } },
      relations: ['treatment'],
    });
  }
}
