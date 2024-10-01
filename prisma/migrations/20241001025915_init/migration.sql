-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_branchId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `branchId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
