import { injectable } from 'inversify';
import { AppDataSource } from '@database/data-source';

@injectable()
export default class AnimalCharacteristicRepository {

    public async saveOrUpdateCharacteristic(data) {
        const newRow =  await AppDataSource.createQueryBuilder()
            .insert()
            .into("animal_characteristics")
            .values({
                animalId: data.animalId,
                type: data.type,
                value: data.value
            })
            .orUpdate(["value"], ["animal_id", "type"], {
                skipUpdateIfNoValuesChanged: true,
            })
            .execute();
        return newRow;
    }


    public async deleteCharacteristic(data) {
        await AppDataSource.createQueryBuilder()
            .delete()
            .from("animal_characteristics")
            .where("animal_id = :animalId and type = :type", { animalId: data.animalId, type: data.type })
            .execute();
    }

    public async deleteAllCharacteristicsByAnimalId(animalId) {
        await AppDataSource.createQueryBuilder()
            .delete()
            .from("animal_characteristics")
            .where("animal_id = :animalId", { animalId: animalId })
            .execute();
    }
}