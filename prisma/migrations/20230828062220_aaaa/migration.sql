/*
  Warnings:

  - You are about to drop the column `id_ponderacionCriterio` on the `puntajeconcursante` table. All the data in the column will be lost.
  - Added the required column `id_criterio` to the `puntajeConcursante` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `puntajeconcursante` DROP FOREIGN KEY `puntajeConcursante_id_ponderacionCriterio_fkey`;

-- AlterTable
ALTER TABLE `puntajeconcursante` DROP COLUMN `id_ponderacionCriterio`,
    ADD COLUMN `id_criterio` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `puntajeConcursante` ADD CONSTRAINT `puntajeConcursante_id_criterio_fkey` FOREIGN KEY (`id_criterio`) REFERENCES `criterio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
