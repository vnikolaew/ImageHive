import React from "react";
import FileDropzone from "@/app/upload/_components/FileDropzone";
import { xprisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ImageUploadStoreProvider } from "@/app/upload/_providers/ImageUploadStoreProvider";

const UPLOAD_LIMIT = 10;

export const dynamic = `force-dynamic`;

function oneWeekAgo() {
   return new Date(new Date().getTime() - (60 * 60 * 24 * 7 * 1000));
}

const Page = async () => {
   const session = await auth();

   const userImagesCount = await xprisma.image.count({
      where: {
         AND: [
            {
               userId: session?.user?.id as string,
               is_deleted: false,
            },
            {
               createdAt: {
                  gte: oneWeekAgo(),
               },
            },
         ],
      },
   });

   return (
      <ImageUploadStoreProvider>
         <main className="flex min-h-screen flex-col items-center justify-start">
            <h2 className={`mt-12 text-3xl font-semibold `}>
               Upload media.
            </h2>
            <p className={`mt-2 max-w-[600px] text-center`}>
               Join our community of creators and showcase your talent by uploading your media!
            </p>
            <FileDropzone uploadsRemaining={UPLOAD_LIMIT - userImagesCount} />
         </main>
      </ImageUploadStoreProvider>
   );
};

export default Page;