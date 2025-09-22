import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Animal } from "./animal";

@Entity()
export class Treatment {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public treatmentName: string;

    @Column({
        default: true
    })
    public active: boolean;

    @Column("boolean")
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
