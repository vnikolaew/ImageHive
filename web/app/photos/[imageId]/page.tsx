import React, { cache, Suspense } from "react";
import { xprisma } from "@/lib/prisma";
import Image from "next/image";
import path from "path";
import { getFileName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ImageSummary from "@/app/photos/[imageId]/_components/ImageSummary";
import { Image as IImage } from "@prisma/client";
import { User } from "@prisma/client";
import ImageDescription from "@/app/photos/[imageId]/_components/ImageDescription";
import ImageCommentsSection from "@/app/photos/[imageId]/_components/ImageCommentsSection";
import ImageTagsSection from "@/app/photos/[imageId]/_components/ImageTagsSection";
import RelatedImagesSection from "@/app/photos/[imageId]/_components/RelatedImagesSection";
import { getImageLikes } from "@/app/_components/HomeFeedSection";

export interface PageProps {
   params: { imageId: string };
}

export type ImageSummary = IImage & {
   owner: User & { _count: { followedBy: number } },
   _count: { likes: number, comments: number, downloads: number, collections: number }
};

const getImage = cache(async (id: string) => {
   const image = await xprisma.image
      .findUnique({
         where: { id },
         include: {
            owner: {
               include: {
                  _count: { select: { followedBy: true } },
               },
            },
            _count: { select: { likes: true, comments: true, downloads: true, collections: true } },
         },
      });

   return image;
});


const Page = async ({ params }: PageProps) => {
   const image = await getImage(params.imageId);
   if (!image) return notFound();


   const likedImages = await getImageLikes();
   const haveILiked = new Set<string>(likedImages.map(i => i.imageId))
      .has(image.id);

   const { verifyPassword, updatePassword, ...rest } = image.owner;
   // @ts-ignore
   image.owner = rest;

   return (
      <main className="m-8 grid gap-12 grid-cols-[5fr_2fr] min-h-[70vh]">
         <div className={`bg-transparent h-full`}>
            <div className={`w-full flex flex-col items-center mx-auto !h-[70vh]`}>
               <div
                  className={`!h-full relative group aspect-[5/3] z-10 overflow-hidden hover:opacity-80 transition-opacity duration-200`}>
                  <div className={`absolute hidden top-3 left-3 group-hover:block`}>

                  </div>
                  <div className={`absolute hidden top-3 right-3 group-hover:block`}>
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger className={`cursor-auto`}>
                              <Button variant={`outline`}
                                      className={`rounded-full p-2 bg-transparent hover:bg-transparent hover:border-[1px] hover:border-white transition-colors duration-200`}
                                      size={`icon`}>
                                 <Flag className={`text-white`} />
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent
                              side={`bottom`}
                              className={`!text-xs rounded-lg bg-black text-white flex gap-1`}>
                              Report
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  </div>
                  <Image
                     id={`image-${image.id}`}
                     objectFit={`cover`}
                     layout="responsive"
                     width={600}
                     height={600}
                     // fill
                     // className={`h-full`}
                     src={path.join(`/uploads`, getFileName(image?.absolute_url)!).replaceAll(`\\`, `/`)} alt={``} />

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
            <ImageSummary haveILiked={haveILiked} image={image} />
         </div>
      </main>
   );
};

export default Page;