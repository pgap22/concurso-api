-- CreateEnum
CREATE TYPE "estadoConcurso" AS ENUM ('inscripcion', 'evaluacion', 'finalizado');

-- CreateEnum
CREATE TYPE "roles" AS ENUM ('jurado', 'admin', 'encargado');

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "roles" NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concursante" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "grado" TEXT NOT NULL,

    CONSTRAINT "concursante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concursoJurado" (
    "id" TEXT NOT NULL,
    "id_concurso" TEXT NOT NULL,
    "id_jurado" TEXT NOT NULL,

    CONSTRAINT "concursoJurado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concurso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "estadoConcurso" NOT NULL DEFAULT 'inscripcion',
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "concurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concursanteConcurso" (
    "id" TEXT NOT NULL,
    "id_concurso" TEXT NOT NULL,
    "id_concursante" TEXT NOT NULL,

    CONSTRAINT "concursanteConcurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluacionConcursante" (
    "id" TEXT NOT NULL,
    "puntajeTotal" INTEGER DEFAULT 0,
    "id_jurado" TEXT NOT NULL,
    "id_concursante" TEXT NOT NULL,
    "id_concurso" TEXT NOT NULL,

    CONSTRAINT "evaluacionConcursante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puntajeConcursante" (
    "id" TEXT NOT NULL,
    "id_evaluacion" TEXT NOT NULL,
    "id_criterio" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,

    CONSTRAINT "puntajeConcursante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criterio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_concurso" TEXT NOT NULL,

    CONSTRAINT "criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ponderacionCriterio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "id_criterio" TEXT NOT NULL,

    CONSTRAINT "ponderacionCriterio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "concursoJurado" ADD CONSTRAINT "concursoJurado_id_jurado_fkey" FOREIGN KEY ("id_jurado") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concursoJurado" ADD CONSTRAINT "concursoJurado_id_concurso_fkey" FOREIGN KEY ("id_concurso") REFERENCES "concurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concurso" ADD CONSTRAINT "concurso_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concursanteConcurso" ADD CONSTRAINT "concursanteConcurso_id_concurso_fkey" FOREIGN KEY ("id_concurso") REFERENCES "concurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concursanteConcurso" ADD CONSTRAINT "concursanteConcurso_id_concursante_fkey" FOREIGN KEY ("id_concursante") REFERENCES "concursante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacionConcursante" ADD CONSTRAINT "evaluacionConcursante_id_jurado_fkey" FOREIGN KEY ("id_jurado") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacionConcursante" ADD CONSTRAINT "evaluacionConcursante_id_concursante_fkey" FOREIGN KEY ("id_concursante") REFERENCES "concursante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacionConcursante" ADD CONSTRAINT "evaluacionConcursante_id_concurso_fkey" FOREIGN KEY ("id_concurso") REFERENCES "concurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puntajeConcursante" ADD CONSTRAINT "puntajeConcursante_id_criterio_fkey" FOREIGN KEY ("id_criterio") REFERENCES "criterio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puntajeConcursante" ADD CONSTRAINT "puntajeConcursante_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "evaluacionConcursante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criterio" ADD CONSTRAINT "criterio_id_concurso_fkey" FOREIGN KEY ("id_concurso") REFERENCES "concurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ponderacionCriterio" ADD CONSTRAINT "ponderacionCriterio_id_criterio_fkey" FOREIGN KEY ("id_criterio") REFERENCES "criterio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
