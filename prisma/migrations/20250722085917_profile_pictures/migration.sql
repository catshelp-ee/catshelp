-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_profile_animal_id_fkey`;

-- AlterTable
ALTER TABLE `files` MODIFY `profile_animal_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_profile_animal_id_fkey` FOREIGN KEY (`profile_animal_id`) REFERENCES `animals`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
