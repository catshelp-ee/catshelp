import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";

@Entity("animal_characteristics")
export class Characteristic {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public value: string;

    @Column()
    public type: string;

    @Column()
    public animalId: number;

    @ManyToOne(() => Animal, (animal) => animal.animalCharacteristics)
    public animal: Animal;
}
