import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { File } from "./file";
import { AnimalCharacteristic } from "./animal-characteristic";
import { Treatment } from "./treatment";
import { AnimalRescue } from "./animal-rescue";
import { AnimalToFosterHome } from "./animal-to-foster-home";

@Entity()
export class Animal {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public name: string;

    @Column("date")
    public birthday: Date;

    @Column("varchar")
    public profileTitle: string;

    @Column("text")
    public description: string;

    @Column("varchar")
    public status: string;

    @Column("varchar")
    public chipNumber: string;

    @Column("boolean", {
        default: false
    })
    public chipRegisteredWithUs: boolean;

    @OneToMany(() => File, (file) => file.animal)
    public files: File;

    @OneToMany(() => AnimalCharacteristic, (animalCharacteristic) => animalCharacteristic.animal)
    public animalCharacteristics: AnimalCharacteristic[];

    @OneToMany(() => Treatment, (treatment) => treatment.animal)
    public treatments: Treatment[];

    @OneToMany(() => AnimalToFosterHome, animalToFosterHome => animalToFosterHome.animal)
    public animalToFosterHome: AnimalToFosterHome[];

    @OneToOne(() => AnimalRescue, (animalRescue) => animalRescue.animal)
    public animalRescue: AnimalRescue;
}
