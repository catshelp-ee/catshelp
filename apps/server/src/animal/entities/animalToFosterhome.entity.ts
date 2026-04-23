import { FosterHome } from "@user/entities/foster-home.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";
import { IAnimalToFosterHome } from "@catshelp/types";

@Entity("animals_to_foster_homes")
export class AnimalToFosterHome implements IAnimalToFosterHome {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public fosterHomeEndDate: Date;

    @Column()
    public animalId: number;

    @Column()
    public fosterHomeId: number;

    @ManyToOne(() => Animal, (animal) => animal.animalToFosterHome)
    public animal: Animal

    @ManyToOne(() => FosterHome, (fosterHome) => fosterHome.animalToFosterHome)
    public fosterHome: FosterHome
}
