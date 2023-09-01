-- AlterTable
ALTER TABLE `usuario` MODIFY `rol` ENUM('jurado', 'admin', 'encargado') NOT NULL;
