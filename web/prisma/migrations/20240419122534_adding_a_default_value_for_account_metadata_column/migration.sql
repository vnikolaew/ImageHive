-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "metadata" DROP NOT NULL,
ALTER COLUMN "metadata" SET DEFAULT 'null';
