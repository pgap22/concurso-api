/*
  Warnings:

  - Added the required column `institucion` to the `concursante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "concursante" ADD COLUMN     "institucion" TEXT NOT NULL;
