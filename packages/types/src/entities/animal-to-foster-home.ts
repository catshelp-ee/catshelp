import { IAnimal } from "./animal";
import { IFosterHome } from "./foster-home";

export interface IAnimalToFosterHome {
    id: number;
    fosterHomeEndDate: Date;
    animalId: number;
    fosterHomeId: number;

    // Relations
    animal: IAnimal;
    fosterHome: IFosterHome;
}