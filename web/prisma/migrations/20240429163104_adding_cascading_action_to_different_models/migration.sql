-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- DropForeignKey
ALTER TABLE "CollectionImage" DROP CONSTRAINT "CollectionImage_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "ImageDownload" DROP CONSTRAINT "ImageDownload_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ImageLike" DROP CONSTRAINT "ImageLike_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ImageView" DROP CONSTRAINT "ImageView_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageLike" ADD CONSTRAINT "ImageLike_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionImage" ADD CONSTRAINT "CollectionImage_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ImageCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageDownload" ADD CONSTRAINT "ImageDownload_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageView" ADD CONSTRAINT "ImageView_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
