import { IAnimal } from "./animal";

export interface IRescue {
    id: number;
    rescueDate: Date;
    state: string;
    address: string;
    locationNotes: string;
    rankNr: string;
    animalId: number;

    // Relation
    animal: IAnimal;
}