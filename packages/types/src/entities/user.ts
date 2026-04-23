import { IFosterHome } from "./foster-home";

export interface IUser {
    id: number;
    fullName: string;
    role: string;
    email: string;
    identityCode: string;
    citizenship: string;
    createdAt: Date;

    // Relation
    fosterHome: IFosterHome;
}