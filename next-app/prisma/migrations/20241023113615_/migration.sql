/*
  Warnings:

  - Added the required column `backendUrl` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `websocketUrl` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Made the column `submissionTime` on table `Submission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "backendUrl" TEXT NOT NULL,
ADD COLUMN     "websocketUrl" TEXT NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "executionTime" DROP NOT NULL,
ALTER COLUMN "executionTime" SET DATA TYPE TEXT,
ALTER COLUMN "submissionTime" SET NOT NULL;

-- CreateTable
CREATE TABLE "Challange" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "Challange_pkey" PRIMARY KEY ("id")
);
