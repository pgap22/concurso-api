-- CreateTable
CREATE TABLE `evaluacionConcursante` (
    `id` VARCHAR(191) NOT NULL,
    `puntajeTotal` INTEGER NULL DEFAULT 0,
    `id_jurado` VARCHAR(191) NOT NULL,
    `id_concursante` VARCHAR(191) NOT NULL,
    `id_concurso` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `puntajeConcursante` (
    `id` VARCHAR(191) NOT NULL,
    `id_evaluacion` VARCHAR(191) NOT NULL,
    `id_ponderacionCriterio` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `evaluacionConcursante` ADD CONSTRAINT `evaluacionConcursante_id_jurado_fkey` FOREIGN KEY (`id_jurado`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluacionConcursante` ADD CONSTRAINT `evaluacionConcursante_id_concursante_fkey` FOREIGN KEY (`id_concursante`) REFERENCES `concursante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluacionConcursante` ADD CONSTRAINT `evaluacionConcursante_id_concurso_fkey` FOREIGN KEY (`id_concurso`) REFERENCES `concurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `puntajeConcursante` ADD CONSTRAINT `puntajeConcursante_id_ponderacionCriterio_fkey` FOREIGN KEY (`id_ponderacionCriterio`) REFERENCES `ponderacionCriterio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `puntajeConcursante` ADD CONSTRAINT `puntajeConcursante_id_evaluacion_fkey` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluacionConcursante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
