/*
  Warnings:

  - Added the required column `created_by` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `promotional_price` DOUBLE NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
