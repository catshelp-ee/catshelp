import { Animal } from "@animal/entities/animal.entity";
import { IFile } from "@catshelp/types";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("files")
export class File implements IFile {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public uuid: string;

    @Column()
    public type: string;

    @Column()
    public animalId: number;

    @ManyToOne(() => Animal, (animal) => animal.files)
    public animal: Animal;
}
