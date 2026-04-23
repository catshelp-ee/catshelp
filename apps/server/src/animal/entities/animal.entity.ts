import { File } from "@file/file.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AnimalToFosterHome } from "./animalToFosterhome.entity";
import { Characteristic } from "./characteristic.entity";
import { Rescue } from "./rescue.entity";
import { Treatment } from "./treatment.entity";
import { IAnimal } from "@catshelp/types";

@Entity("animals")
export class Animal implements IAnimal {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({
        type: "date",
        nullable: true
    })
    public birthday: Date | null;

    @Column()
    public profileTitle: string;

    @Column("text")
    public description: string;

    @Column()
    public status: string;

    @Column()
    public chipNumber: string;

    @Column({ default: false })
    public chipRegisteredWithUs: boolean;

    @Column()
    public requirementsForNewFamily: string;

    @Column()
    public additionalNotes: string;

    @OneToMany(() => File, (file) => file.animal)
    public files: File[];

    @OneToMany(() => AnimalToFosterHome, animalToFosterHome => animalToFosterHome.animal)
    public animalToFosterHome: AnimalToFosterHome[];

    @OneToMany(() => Characteristic, (animalCharacteristic) => animalCharacteristic.animal)
    public animalCharacteristics: Characteristic[];

    @OneToMany(() => Treatment, (treatment) => treatment.animal)
    public treatments: Treatment[];

    @OneToOne(() => Rescue, (animalRescue) => animalRescue.animal)
    public animalRescue: Rescue;
}
