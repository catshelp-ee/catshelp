import { IAnimal } from "./animal";

export interface ICharacteristic {
    id: number;
    value: string;
    type: string;
    animalId: number;

    // Relation
    animal: IAnimal;
}