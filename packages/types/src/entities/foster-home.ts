import { IAnimalToFosterHome } from "./animal-to-foster-home";
import { IUser } from "./user";

export interface IFosterHome {
    id: number;
    location: string;
    startDate: Date;
    endDate: Date;
    catshelpMentorId: number;
    userId: number;

    // Relations
    user: IUser;
    animalToFosterHome: IAnimalToFosterHome[];
}