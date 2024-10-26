/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Challange` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Challange_name_key" ON "Challange"("name");
