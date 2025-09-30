import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateToTypeormStructure1759234365767 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE animal_rescues ADD COLUMN animal_id INT
        `);

        await queryRunner.query(`
            UPDATE animal_rescues JOIN animals_to_animal_rescues 
            ON animal_rescues.id = animals_to_animal_rescues.animal_rescue_id
            SET animal_rescues.animal_id = animals_to_animal_rescues.animal_id
        `);

        await queryRunner.query(`
            CREATE INDEX animal_rescues_animal_id_fkey ON animal_rescues (animal_id) USING BTREE
        `);

        await queryRunner.query(`
            ALTER TABLE animal_rescues ADD CONSTRAINT animal_rescues_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES animals (id)
        `);

        await queryRunner.query(`
            DROP TABLE animals_to_animal_rescues
        `);

        await queryRunner.query(`
            DROP TABLE cache
        `);

        await queryRunner.query(`
            ALTER TABLE treatments ADD COLUMN confirmed TINYINT
        `);

        await queryRunner.query(`
            ALTER TABLE treatments ADD COLUMN confirmationDate DATETIME(3)
        `);

        await queryRunner.query(`
            ALTER TABLE treatments ADD COLUMN visitDate DATETIME(3)
        `);

        await queryRunner.query(`
            ALTER TABLE treatments ADD COLUMN nextVisitDate DATETIME(3)
        `);

        await queryRunner.query(`
            ALTER TABLE treatments ADD COLUMN animal_id INT
        `);

        await queryRunner.query(`
            CREATE INDEX treatments_animal_id_fkey ON treatments (animal_id) USING BTREE
        `);

        await queryRunner.query(`
            ALTER TABLE treatments ADD CONSTRAINT treatments_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES animals (id)
        `);

        await queryRunner.query(`
            ALTER TABLE treatments DROP FOREIGN KEY treatments_treatment_history_id_fkey;
        `);

        await queryRunner.query(`
            ALTER TABLE treatments DROP COLUMN treatment_history_id
        `);

        await queryRunner.query(`
            ALTER TABLE users DROP COLUMN blacklisted
        `);

        await queryRunner.query(`
            ALTER TABLE users DROP COLUMN blacklisted_reason
        `);

        await queryRunner.query(`
            DROP TABLE treatment_history
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
