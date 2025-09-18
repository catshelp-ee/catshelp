import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Animal } from "./animal";
import { FosterHome } from "./foster-home";

@Entity()
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
