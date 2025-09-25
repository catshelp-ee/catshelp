import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1758805252363 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        `
        CREATE TABLE IF NOT EXISTS 'animals' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'name' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'birthday' DATETIME(3) NULL DEFAULT NULL,
            'profile_title' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'status' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'chip_number' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'chip_registered_with_us' TINYINT(1) NOT NULL DEFAULT '0',
            'description' TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            PRIMARY KEY ('id') USING BTREE
        );

        CREATE TABLE IF NOT EXISTS 'animals_to_animal_rescues' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'animal_rescue_id' INT(11) NOT NULL,
            'animal_id' INT(11) NOT NULL,
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'animals_to_animal_rescues_animal_id_animal_rescue_id_key' ('animal_id', 'animal_rescue_id') USING BTREE,
            INDEX 'animals_to_animal_rescues_animal_rescue_id_fkey' ('animal_rescue_id') USING BTREE,
            CONSTRAINT 'animals_to_animal_rescues_animal_id_fkey' FOREIGN KEY ('animal_id') REFERENCES 'animals' ('id') ON UPDATE CASCADE ON DELETE RESTRICT,
            CONSTRAINT 'animals_to_animal_rescues_animal_rescue_id_fkey' FOREIGN KEY ('animal_rescue_id') REFERENCES 'animal_rescues' ('id') ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS 'animals_to_foster_homes' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'animal_id' INT(11) NOT NULL,
            'foster_home_id' INT(11) NOT NULL,
            'foster_home_end_date' DATETIME(3) NULL DEFAULT NULL,
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'animals_to_foster_homes_animal_id_foster_home_id_key' ('animal_id', 'foster_home_id') USING BTREE,
            INDEX 'animals_to_foster_homes_foster_home_id_fkey' ('foster_home_id') USING BTREE,
            CONSTRAINT 'animals_to_foster_homes_animal_id_fkey' FOREIGN KEY ('animal_id') REFERENCES 'animals' ('id') ON UPDATE CASCADE ON DELETE RESTRICT,
            CONSTRAINT 'animals_to_foster_homes_foster_home_id_fkey' FOREIGN KEY ('foster_home_id') REFERENCES 'foster_homes' ('id') ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS 'animal_characteristics' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'animal_id' INT(11) NOT NULL,
            'type' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'value' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'animal_characteristics_animal_id_type_key' ('animal_id', 'type') USING BTREE,
            CONSTRAINT 'animal_characteristics_animal_id_fkey' FOREIGN KEY ('animal_id') REFERENCES 'animals' ('id') ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS 'animal_rescues' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'rescue_date' DATETIME(3) NULL DEFAULT NULL,
            'state' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'address' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'location_notes' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'rank_nr' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'animal_rescues_rank_nr_key' ('rank_nr') USING BTREE
        );

        CREATE TABLE IF NOT EXISTS 'cache' (
            'key_name' VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
            'value' TEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
            PRIMARY KEY ('key_name') USING BTREE
        );

        CREATE TABLE IF NOT EXISTS 'files' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'animal_id' INT(11) NOT NULL,
            'profile_animal_id' INT(11) NULL DEFAULT NULL,
            'uuid' VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'files_profile_animal_id_key' ('profile_animal_id') USING BTREE,
            INDEX 'files_animal_id_fkey' ('animal_id') USING BTREE,
            CONSTRAINT 'files_animal_id_fkey' FOREIGN KEY ('animal_id') REFERENCES 'animals' ('id') ON UPDATE CASCADE ON DELETE RESTRICT,
            CONSTRAINT 'files_profile_animal_id_fkey' FOREIGN KEY ('profile_animal_id') REFERENCES 'animals' ('id') ON UPDATE CASCADE ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS 'foster_homes' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'location' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'user_id' INT(11) NOT NULL,
            'start_date' DATETIME(3) NULL DEFAULT NULL,
            'end_date' DATETIME(3) NULL DEFAULT NULL,
            'catshelp_mentor_id' INT(11) NULL DEFAULT NULL,
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'foster_homes_user_id_key' ('user_id') USING BTREE,
            CONSTRAINT 'foster_homes_user_id_fkey' FOREIGN KEY ('user_id') REFERENCES 'users' ('id') ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS 'revoked_tokens' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'token' VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
            'expires_at' DATETIME(3) NOT NULL,
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'revoked_tokens_token_key' ('token') USING BTREE
        );

        CREATE TABLE IF NOT EXISTS 'treatments' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'treatmentName' VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
            'active' TINYINT(1) NOT NULL DEFAULT '1',
            'treatmentHistoryId' INT(11) NOT NULL,
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'treatments_treatmentHistoryId_key' ('treatmentHistoryId') USING BTREE,
            CONSTRAINT 'treatments_treatmentHistoryId_fkey' FOREIGN KEY ('treatmentHistoryId') REFERENCES 'treatment_history' ('id') ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS 'treatment_history' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'animal_id' INT(11) NOT NULL,
            'confirmationDate' DATETIME(3) NULL DEFAULT NULL,
            'confirmed' TINYINT(1) NOT NULL,
            'visitDate' DATETIME(3) NULL DEFAULT NULL,
            'nextVisitDate' DATETIME(3) NULL DEFAULT NULL,
            PRIMARY KEY ('id') USING BTREE,
            INDEX 'treatment_history_animal_id_fkey' ('animal_id') USING BTREE,
            CONSTRAINT 'treatment_history_animal_id_fkey' FOREIGN KEY ('animal_id') REFERENCES 'animals' ('id') ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS 'users' (
            'id' INT(11) NOT NULL AUTO_INCREMENT,
            'full_name' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'email' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'identity_code' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'citizenship' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'blacklisted' TINYINT(1) NOT NULL DEFAULT '0',
            'blacklisted_reason' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            'created_at' DATETIME(3) NOT NULL DEFAULT current_timestamp(3),
            'role' VARCHAR(191) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
            PRIMARY KEY ('id') USING BTREE,
            UNIQUE INDEX 'users_full_name_key' ('full_name') USING BTREE
        );
        `
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
