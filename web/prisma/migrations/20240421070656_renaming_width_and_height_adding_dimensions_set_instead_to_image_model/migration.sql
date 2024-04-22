/*
  Warnings:

  - You are about to drop the column `file_name` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Image` table. All the data in the column will be lost.
  - Added the required column `original_file_name` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "file_name",
DROP COLUMN "height",
DROP COLUMN "width",
ADD COLUMN     "dimensions_set" TEXT[],
ADD COLUMN     "original_file_name" TEXT NOT NULL,
ADD COLUMN     "title" VARCHAR(200);
