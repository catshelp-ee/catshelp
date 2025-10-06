import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal";

@Entity("animal_characteristics")
export class AnimalCharacteristic {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public value: string;

    @Column("varchar")
    public type: string;

    @Column("integer")
    public animalId: number;

    @ManyToOne(() => Animal, (animal) => animal.animalCharacteristics)
    public animal: Animal;
}
