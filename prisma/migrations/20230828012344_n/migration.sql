/*
  Warnings:

  - You are about to drop the column `datos` on the `concursante` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `concursante` table. All the data in the column will be lost.
  - Added the required column `apellidos` to the `concursante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grado` to the `concursante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombres` to the `concursante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `concursante` DROP COLUMN `datos`,
    DROP COLUMN `nombre`,
    ADD COLUMN `apellidos` VARCHAR(191) NOT NULL,
    ADD COLUMN `grado` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombres` VARCHAR(191) NOT NULL;
