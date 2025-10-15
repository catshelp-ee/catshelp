import { File } from "@file/file.entity";
import { FosterHome } from "@user/entities/foster-home.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Characteristic } from "./characteristic.entity";
import { Rescue } from "./rescue.entity";
import { Treatment } from "./treatment.entity";

@Entity()
export class Animal {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public birthday: Date;

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

    @OneToMany(() => File, (file) => file.animal)
    public files: File;

    @OneToMany(() => Characteristic, (animalCharacteristic) => animalCharacteristic.animal)
    public animalCharacteristics: Characteristic[];

    @OneToMany(() => Treatment, (treatment) => treatment.animal)
    public treatments: Treatment[];

    @ManyToOne(() => FosterHome, fosterHome => fosterHome.animals)
    public fosterHome: FosterHome;

    @OneToOne(() => Rescue, (animalRescue) => animalRescue.animal)
    public animalRescue: Rescue;
}
