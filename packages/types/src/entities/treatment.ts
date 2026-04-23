import { IAnimal } from "./animal";

export interface ITreatment {
    id: number;
    treatmentName: string;
    active: boolean;
    confirmed: boolean;
    confirmationDate: Date;
    visitDate: Date;
    nextVisitDate: Date;
    animalId: number;

    // Relation
    animal: IAnimal;
}