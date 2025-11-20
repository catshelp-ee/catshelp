import { FosterHome } from "@user/entities/foster-home.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";

@Entity("animals_to_foster_homes")
export class AnimalToFosterHome {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public fosterHomeEndDate: Date;

    @ManyToOne(() => Animal, (animal) => animal.animalToFosterHome)
    public animal: Animal

    @ManyToOne(() => FosterHome, (fosterHome) => fosterHome.animalToFosterHome)
    public fosterHome: FosterHome
}
