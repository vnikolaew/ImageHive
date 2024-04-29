-- CreateTable
CREATE TABLE "ImageView" (
    "imageId" UUID NOT NULL,
    "metadata" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageView_pkey" PRIMARY KEY ("userId","imageId")
);

-- AddForeignKey
ALTER TABLE "ImageView" ADD CONSTRAINT "ImageView_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageView" ADD CONSTRAINT "ImageView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
