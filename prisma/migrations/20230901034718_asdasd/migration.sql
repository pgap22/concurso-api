-- AlterTable
ALTER TABLE `concurso` ADD COLUMN `estado` ENUM('inscripcion', 'evaluacion', 'finalizado') NOT NULL DEFAULT 'inscripcion';
