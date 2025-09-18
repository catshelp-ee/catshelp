import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RevokedToken {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        unique: true
    })
    public token: string;

    @Column({
        type: "datetime"
    })
    public expiresAt: Date;
}
