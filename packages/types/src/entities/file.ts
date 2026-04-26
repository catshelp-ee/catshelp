import { IAnimal } from "./animal";

export interface IFile {
    id: number;
    uuid: string;
    type: string;
    animalId: number;
    
    // Relation
    animal: IAnimal;
}