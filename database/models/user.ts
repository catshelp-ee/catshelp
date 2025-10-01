import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from "typeorm";
import { FosterHome } from './foster-home';

@Entity("users")
export class User {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {
        unique: true
    })
    public fullName: string;

    @Column("varchar")
    public role: string;

    @Column("varchar")
    public email: string;

    @Column("varchar")
    public identityCode: string;

    @Column("varchar")
    public citizenship: string;

    @CreateDateColumn()
    public createdAt: Date;

    @OneToOne(() => FosterHome)
    public fosterHome: FosterHome;
}
