import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Animal } from "./animal";

@Entity()
export class AnimalRescue {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public rescueDate: Date;

    @Column()
    public state: string;

    @Column()
    public address: string;

    @Column()
    public locationNotes: string;

    @Column({
        unique: true
    })
    public rankNr: string;

    @OneToOne(() => Animal, (animal) => animal.animalRescue)
    @JoinColumn()
    public animal: Animal
}
