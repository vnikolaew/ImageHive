import React from "react";
import FileDropzone from "@/app/upload/_components/FileDropzone";
import { ImageUploadStoreProvider } from "@/app/upload/_providers/ImageUploadStoreProvider";
import { getUserImagesCount } from "@/app/upload/_queries";

const UPLOAD_LIMIT = 10;

export const dynamic = `force-dynamic`;

const Page = async () => {
   const userImagesCount = await getUserImagesCount();

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