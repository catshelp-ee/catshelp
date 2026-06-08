import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFilesTableColumns1779369639697 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE files ADD COLUMN extension varchar(191);
        `);

        await queryRunner.query(`
            UPDATE files SET extension = 'jpg';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE files DROP COLUMN extension;
        `);
    }
}
