import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewAnimalColumns1777479186307 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE animals ADD COLUMN chronic_conditions TEXT;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE animals DROP COLUMN chronic_conditions;
        `);
    }

}
