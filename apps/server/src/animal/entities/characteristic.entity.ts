import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";
import { ICharacteristic } from "@catshelp/types";

@Entity("animal_characteristics")
export class Characteristic implements ICharacteristic {

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
