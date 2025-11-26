import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";

@Entity("animal_rescues")
export class Rescue {

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

    @Column({ unique: true })
    public rankNr: string;

    @Column()
    public animalId: number;

    @OneToOne(() => Animal, (animal) => animal.animalRescue)
    @JoinColumn({ name: "animal_id" })
    public animal: Animal
}
