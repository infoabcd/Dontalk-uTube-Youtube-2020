-- AlterTable
ALTER TABLE "User" ADD COLUMN "banner" TEXT;
ALTER TABLE "User" ADD COLUMN "description" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN "hlsMasterUrl" TEXT;
ALTER TABLE "Video" ADD COLUMN "processingStatus" TEXT NOT NULL DEFAULT 'ready';
