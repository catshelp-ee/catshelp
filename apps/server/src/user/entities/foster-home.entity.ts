import { AnimalToFosterHome } from "@animal/entities/animalToFosterhome.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("foster_homes")
export class FosterHome {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public location: string;

    @Column()
    public startDate: Date;

    @Column()
    public endDate: Date;

    @Column()
    public catshelpMentorId: number;

    @Column()
    public userId: number;

    @OneToOne(() => User, (user) => user.fosterHome)
    @JoinColumn()
    public user: User;

    @OneToMany(() => AnimalToFosterHome, animalToFosterHome => animalToFosterHome.fosterHome)
    public animalToFosterHome: AnimalToFosterHome[];
}
