import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Animal } from "./animal";

@Entity()
export class Treatment {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public treatmentName: string;

    @Column("boolean", {
        default: true
    })
    public active: boolean;

    @Column("boolean")
    public confirmed: boolean;

    @Column("date")
    public confirmationDate: Date;

    @Column("date")
    public visitDate: Date;

    @Column("date")
    public nextVisitDate: Date;

    @ManyToOne(() => Animal, (animal) => animal.treatments)
    public animal: Animal;
}
