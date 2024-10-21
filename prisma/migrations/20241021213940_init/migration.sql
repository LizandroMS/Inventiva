-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `companyAddress` VARCHAR(191) NULL,
    ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `paymentType` VARCHAR(191) NULL DEFAULT 'Boleta',
    ADD COLUMN `ruc` VARCHAR(191) NULL;
