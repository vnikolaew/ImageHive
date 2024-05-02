import React, { Suspense } from "react";
import Image from "next/image";
import path from "path";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getImage, getImageInfo } from "./_queries";
import { auth } from "../../../auth";
import { xprisma } from "@nx-web/db";
import AIGenerated from "./_components/AIGenerated";
import ReportImageButton from "./_components/ReportImageButton";
import { getFileName, isAbsoluteUrl } from "@nx-web/shared";
import ImageDescription from "./_components/ImageDescription";
import ImageCommentsSection from "./_components/ImageCommentsSection";
import ImageTagsSection from "./_components/ImageTagsSection";
import RelatedImagesSection from "./_components/RelatedImagesSection";
import ImageSummary from "./_components/ImageSummary";

export interface PageProps {
   params: { imageId: string };
}

const Page = async ({ params: { imageId } }: PageProps) => {
   const session = await auth();
   if (session) {
      const imageView = await xprisma.imageView.upsert({
         where: { userId_imageId: { imageId, userId: session?.user?.id as string } },
         create: { userId: session?.user?.id!, imageId, metadata: {} },
         update: { userId: session?.user?.id!, imageId, metadata: {} },
      });
   }

   const image = await getImage(imageId);
   if (!image) return notFound();

   const { haveILiked, haveISaved, haveIFollowed, haveIDownloaded } = await getImageInfo(image);

   return (
      <main className="m-8 grid gap-12 grid-cols-[5fr_2fr] min-h-[70vh]">
         <div className={`bg-transparent h-full`}>
            <div className={`w-full flex flex-col items-center mx-auto !h-[70vh]`}>
               <div
                  className={`!h-full relative group aspect-[5/3] z-10 overflow-hidden hover:opacity-90 transition-opacity duration-200`}>
                  <div className={`absolute hidden top-3 left-3 group-hover:block`}>
                     {!!image.metadata?.aiGenerated && <AIGenerated />}
                  </div>
                  <ReportImageButton />
                  <Image
                     id={`image-${image.id}`}
                     objectFit={`cover`}
                     layout="responsive"
                     width={600}
                     height={600}
                     src={isAbsoluteUrl(image?.absolute_url) ? image.absolute_url : path.join(`/uploads`, getFileName(image?.absolute_url)!).replaceAll(`\\`, `/`)}
                     alt={``} />
               </div>
            </div>
            <div className={`mt-4`}>
               <ImageDescription image={image} />
               <Suspense fallback={<Loader2 size={16} className={`animate-spin mr-2`} />}>
                  <ImageCommentsSection imageId={image.id} />
               </Suspense>
               <ImageTagsSection image={image} />
               <Suspense fallback={<Loader2 size={16} className={`animate-spin mr-2`} />}>
                  <RelatedImagesSection image={image} />
               </Suspense>
            </div>
         </div>
         <div className={`h-full relative`}>
            <ImageSummary
               haveIFollowed={haveIFollowed}
               haveISaved={haveISaved}
               haveIDownloaded={haveIDownloaded}
               haveILiked={haveILiked}
               image={image} />
         </div>
      </main>
   );
};

export default Page;
