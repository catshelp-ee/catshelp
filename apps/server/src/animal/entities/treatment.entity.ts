import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";

@Entity("treatments")
export class Treatment {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public treatmentName: string;

    @Column({ default: true })
    public active: boolean;

    @Column()
    public confirmed: boolean;

    @Column()
    public confirmationDate: Date;

    @Column()
    public visitDate: Date;

    @Column()
    public nextVisitDate: Date;

    @ManyToOne(() => Animal, (animal) => animal.treatments)
    public animal: Animal;
}
