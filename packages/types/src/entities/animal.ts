import { IAnimalToFosterHome } from "./animal-to-foster-home";
import { ICharacteristic } from "./characteristic";
import { IFile } from "./file";
import { IRescue } from "./rescue";
import { ITreatment } from "./treatment";

export interface IAnimal {
    id: number;
    name: string;
    birthday: Date | null;
    profileTitle: string;
    description: string;
    status: string;
    chipNumber: string;
    chipRegisteredWithUs: boolean;
    requirementsForNewFamily: string;
    additionalNotes: string;
    
    // Relational fields
    files: IFile[];
    animalToFosterHome: IAnimalToFosterHome[];
    animalCharacteristics: ICharacteristic[];
    treatments: ITreatment[];
    animalRescue: IRescue;
}