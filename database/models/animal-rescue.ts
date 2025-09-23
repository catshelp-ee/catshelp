import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Animal } from "./animal";

@Entity()
export class AnimalRescue {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("date")
    public rescueDate: Date;

    @Column("varchar")
    public state: string;

    @Column("varchar")
    public address: string;

    @Column("varchar")
    public locationNotes: string;

    @Column("varchar", {
        unique: true
    })
    public rankNr: string;

    @OneToOne(() => Animal, (animal) => animal.animalRescue)
    @JoinColumn()
    public animal: Animal
}
