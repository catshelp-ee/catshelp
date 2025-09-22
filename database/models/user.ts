import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from "typeorm";
import { FosterHome } from './foster-home';

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        unique: true
    })
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

    @OneToOne(() => FosterHome)
    public fosterHome: FosterHome;
}
