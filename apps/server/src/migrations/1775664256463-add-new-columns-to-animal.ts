import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumnsToAnimal1775664256463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE animals ADD COLUMN requirements_for_new_family TEXT;
        `);

        await queryRunner.query(`
            ALTER TABLE animals ADD COLUMN additional_notes TEXT;
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE animal DROP COLUMN requirements_for_new_family;
        `);

        await queryRunner.query(`
            ALTER TABLE animals DROP COLUMN additional_notes;
        `);
    }

}
