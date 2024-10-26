-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "status" TIMESTAMP(3) NOT NULL,
    "executionTime" TIMESTAMP(3) NOT NULL,
    "submissionTime" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
