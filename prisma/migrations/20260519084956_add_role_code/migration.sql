/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");
