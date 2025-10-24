import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("revoked_tokens")
export class RevokedToken {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public token: string;

    @Column()
    public expiresAt: Date;
}
