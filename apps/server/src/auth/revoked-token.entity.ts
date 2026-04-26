import { IRevokedToken } from "@catshelp/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("revoked_tokens")
export class RevokedToken implements IRevokedToken {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public token: string;

    @Column()
    public expiresAt: Date;
}
