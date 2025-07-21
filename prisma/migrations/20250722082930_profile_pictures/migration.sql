-- CreateTable
CREATE TABLE `animal_charecteristics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animal_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `animal_rescues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rescue_date` DATETIME(3) NULL,
    `state` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `location_notes` VARCHAR(191) NULL,
    `rank_nr` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `animals_to_animal_rescues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animal_rescue_id` INTEGER NOT NULL,
    `animal_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `animals_to_foster_homes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animal_id` INTEGER NOT NULL,
    `foster_home_id` INTEGER NOT NULL,
    `foster_home_end_date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `animals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `birthday` DATETIME(3) NULL,
    `profile_title` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `status` VARCHAR(191) NULL,
    `chip_number` VARCHAR(191) NULL,
    `chip_registered_with_us` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animal_id` INTEGER NOT NULL,
    `profile_animal_id` INTEGER NOT NULL,
    `uuid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `files_animal_id_key`(`animal_id`),
    UNIQUE INDEX `files_profile_animal_id_key`(`profile_animal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foster_homes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `catshelp_mentor_id` INTEGER NULL,

    UNIQUE INDEX `foster_homes_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revoked_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `revoked_tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `identity_code` VARCHAR(191) NULL,
    `citizenship` VARCHAR(191) NULL,
    `blacklisted` BOOLEAN NOT NULL DEFAULT false,
    `blacklisted_reason` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `animal_charecteristics` ADD CONSTRAINT `animal_charecteristics_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `animals_to_animal_rescues` ADD CONSTRAINT `animals_to_animal_rescues_animal_rescue_id_fkey` FOREIGN KEY (`animal_rescue_id`) REFERENCES `animal_rescues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `animals_to_animal_rescues` ADD CONSTRAINT `animals_to_animal_rescues_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `animals_to_foster_homes` ADD CONSTRAINT `animals_to_foster_homes_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `animals_to_foster_homes` ADD CONSTRAINT `animals_to_foster_homes_foster_home_id_fkey` FOREIGN KEY (`foster_home_id`) REFERENCES `foster_homes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_profile_animal_id_fkey` FOREIGN KEY (`profile_animal_id`) REFERENCES `animals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foster_homes` ADD CONSTRAINT `foster_homes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
