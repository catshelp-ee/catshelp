import { Animal } from "@animal/entities/animal.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("fosterhomes")
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

    @OneToMany(() => Animal, animal => animal.fosterHome)
    public animals: Animal[];
}
