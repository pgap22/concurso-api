-- CreateTable
CREATE TABLE `concursoJurado` (
    `id` VARCHAR(191) NOT NULL,
    `id_concurso` VARCHAR(191) NOT NULL,
    `id_jurado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `concursoJurado` ADD CONSTRAINT `concursoJurado_id_jurado_fkey` FOREIGN KEY (`id_jurado`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `concursoJurado` ADD CONSTRAINT `concursoJurado_id_concurso_fkey` FOREIGN KEY (`id_concurso`) REFERENCES `concurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
