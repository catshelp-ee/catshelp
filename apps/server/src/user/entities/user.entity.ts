import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FosterHome } from './foster-home.entity';
import { IUser } from "@catshelp/types";

@Entity("users")
export class User implements IUser {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public fullName: string;

    @Column()
    public role: string;

    @Column()
    public email: string;

    @Column()
    public identityCode: string;

    @Column()
    public citizenship: string;

    @CreateDateColumn()
    public createdAt: Date;

    @OneToOne(() => FosterHome, (fosterhome) => fosterhome.user)
    public fosterHome: FosterHome;
}
