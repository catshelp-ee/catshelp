import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal";

@Entity()
export class File {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public uuid: string;

    @Column("varchar")
    public type: string;

    @ManyToOne(() => Animal, (animal) => animal.files)
    public animal: Animal;
}
