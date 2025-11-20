import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileType1762963323192 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE files ADD COLUMN type varchar(191)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
