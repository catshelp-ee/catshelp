import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RevokedToken {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {
        unique: true
    })
    public token: string;

    @Column("datetime")
    public expiresAt: Date;
}
