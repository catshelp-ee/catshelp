import { Animal } from "@animal/entities/animal.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("files")
export class File {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public uuid: string;

    @Column()
    public type: string;

    @ManyToOne(() => Animal, (animal) => animal.files)
    public animal: Animal;
}
