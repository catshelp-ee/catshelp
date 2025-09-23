import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import { Animal } from "./animal";
import { AnimalToFosterHome } from "./animal-to-foster-home";

@Entity()
export class FosterHome {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public location: string;

    @Column("date")
    public startDate: Date;

    @Column("date")
    public endDate: Date;

    @Column("integer")
    public catshelpMentorId: number;

    @OneToOne(() => User, (user) => user.fosterHome)
    @JoinColumn()
    public user: User;

    @OneToMany(() => AnimalToFosterHome, animalToFosterHome => animalToFosterHome.fosterHome)
    public animalToFosterHome: AnimalToFosterHome[];
}
