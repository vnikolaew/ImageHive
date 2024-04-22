/*
  Warnings:

  - You are about to drop the column `file_extension` on the `Image` table. All the data in the column will be lost.
  - Added the required column `file_format` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "file_extension",
ADD COLUMN     "file_format" TEXT NOT NULL;
