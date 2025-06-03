/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `verification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "verification_value_key" ON "verification"("value");
