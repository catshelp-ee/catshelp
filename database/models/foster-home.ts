import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import { Animal } from "./animal";
import { AnimalToFosterHome } from "./animal-to-foster-home";

@Entity()
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

    @OneToOne(() => User, (user) => user.fosterHome)
    @JoinColumn()
    public user: User;

    @OneToMany(() => AnimalToFosterHome, animalToFosterHome => animalToFosterHome.fosterHome)
    public animalToFosterHome: AnimalToFosterHome[];
}
