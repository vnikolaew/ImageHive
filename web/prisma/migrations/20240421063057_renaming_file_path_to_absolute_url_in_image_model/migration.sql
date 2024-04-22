/*
  Warnings:

  - You are about to drop the column `file_path` on the `Image` table. All the data in the column will be lost.
  - Added the required column `absolute_url` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "file_path",
ADD COLUMN     "absolute_url" TEXT NOT NULL;
