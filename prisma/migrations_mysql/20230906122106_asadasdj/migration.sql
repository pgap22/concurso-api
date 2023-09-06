-- CreateTable
CREATE TABLE `usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rol` ENUM('jurado', 'admin', 'encargado') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concursante` (
    `id` VARCHAR(191) NOT NULL,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `grado` VARCHAR(191) NOT NULL,
    `institucion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concursoJurado` (
    `id` VARCHAR(191) NOT NULL,
    `id_concurso` VARCHAR(191) NOT NULL,
    `id_jurado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concurso` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `estado` ENUM('inscripcion', 'evaluacion', 'finalizado') NOT NULL DEFAULT 'inscripcion',
    `id_usuario` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concursanteConcurso` (
    `id` VARCHAR(191) NOT NULL,
    `id_concurso` VARCHAR(191) NOT NULL,
    `id_concursante` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `id_criterio` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `criterio` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_concurso` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ponderacionCriterio` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,
    `id_criterio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `concursoJurado` ADD CONSTRAINT `concursoJurado_id_jurado_fkey` FOREIGN KEY (`id_jurado`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `concursoJurado` ADD CONSTRAINT `concursoJurado_id_concurso_fkey` FOREIGN KEY (`id_concurso`) REFERENCES `concurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `concurso` ADD CONSTRAINT `concurso_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `concursanteConcurso` ADD CONSTRAINT `concursanteConcurso_id_concurso_fkey` FOREIGN KEY (`id_concurso`) REFERENCES `concurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `concursanteConcurso` ADD CONSTRAINT `concursanteConcurso_id_concursante_fkey` FOREIGN KEY (`id_concursante`) REFERENCES `concursante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluacionConcursante` ADD CONSTRAINT `evaluacionConcursante_id_jurado_fkey` FOREIGN KEY (`id_jurado`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluacionConcursante` ADD CONSTRAINT `evaluacionConcursante_id_concursante_fkey` FOREIGN KEY (`id_concursante`) REFERENCES `concursante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluacionConcursante` ADD CONSTRAINT `evaluacionConcursante_id_concurso_fkey` FOREIGN KEY (`id_concurso`) REFERENCES `concurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `puntajeConcursante` ADD CONSTRAINT `puntajeConcursante_id_criterio_fkey` FOREIGN KEY (`id_criterio`) REFERENCES `criterio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `puntajeConcursante` ADD CONSTRAINT `puntajeConcursante_id_evaluacion_fkey` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluacionConcursante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `criterio` ADD CONSTRAINT `criterio_id_concurso_fkey` FOREIGN KEY (`id_concurso`) REFERENCES `concurso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ponderacionCriterio` ADD CONSTRAINT `ponderacionCriterio_id_criterio_fkey` FOREIGN KEY (`id_criterio`) REFERENCES `criterio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
