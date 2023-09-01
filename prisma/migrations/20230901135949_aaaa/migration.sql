/*
  Warnings:

  - Added the required column `id_usuario` to the `concurso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `concurso` ADD COLUMN `id_usuario` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `concurso` ADD CONSTRAINT `concurso_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
