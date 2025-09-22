import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal";

@Entity()
export class AnimalCharacteristic {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Animal, (animal) => animal.animalCharacteristics)
    public animal: Animal;

    @Column("varchar")
    public value: string;

    @Column("varchar")
    public type: string;
}
