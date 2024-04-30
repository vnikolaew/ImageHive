import React, { cache, Suspense } from "react";
import { xprisma } from "@/lib/prisma";
import Image from "next/image";
import path from "path";
import { getFileName } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import ImageSummary from "@/app/photos/[imageId]/_components/ImageSummary";
import { Image as IImage, Profile } from "@prisma/client";
import { User } from "@prisma/client";
import ImageDescription from "@/app/photos/[imageId]/_components/ImageDescription";
import ImageCommentsSection from "@/app/photos/[imageId]/_components/ImageCommentsSection";
import ImageTagsSection from "@/app/photos/[imageId]/_components/ImageTagsSection";
import RelatedImagesSection from "@/app/photos/[imageId]/_components/RelatedImagesSection";
import { getLikedImageIds } from "@/app/_components/HomeFeedSection";
import { auth } from "@/auth";
import ReportImageButton from "@/app/photos/[imageId]/_components/ReportImageButton";
import AIGenerated from "@/app/photos/[imageId]/_components/AIGenerated";

export interface PageProps {
   params: { imageId: string };
}

export type ImageSummary = IImage & {
   owner: User & { _count: { followedBy: number, following: number }, profile: Profile },
   _count: { likes: number, comments: number, downloads: number, collections: number, views: number }
};

const getImage = cache(async (id: string) => {
   const image = await xprisma.image
      .findUnique({
         where: { id },
         include: {
            owner: {
               include: {
                  _count: { select: { followedBy: true, following: true } },
                  profile: true,
               },
            },
            _count: { select: { likes: true, comments: true, downloads: true, collections: true, views: true } },
         },
      });

   return image;
});


const Page = async ({ params: { imageId } }: PageProps) => {
   const session = await auth();
   const imageView = await xprisma.imageView.upsert({
      where: { userId_imageId: { imageId, userId: session?.user?.id as string } },
      create: { userId: session?.user?.id!, imageId, metadata: {} },
      update: { userId: session?.user?.id!, imageId, metadata: {} },
   });

   const image = await getImage(imageId);
   if (!image) return notFound();

   const likedImages = await getLikedImageIds();
   const haveILiked = likedImages.has(image.id);

   const haveIDownloaded = (await xprisma.imageDownload.count({
      where: {
         imageId: image.id,
         userId: session?.user?.id,
      },
   })) > 0;

   const collections = await xprisma.imageCollection.findMany({
      where: {
         userId: session?.user?.id,
         images: {
            some: {
               imageId: image.id,
            },
         },
      },
   });
   const haveISaved = collections.length > 0;
   const haveIFollowed = (await xprisma.follows.count({
      where: {
         followerId: session?.user?.id,
         followingId: image.owner.id,
      },
   })) > 0;

   const { verifyPassword, updatePassword, ...rest } = image.owner;
   // @ts-ignore
   image.owner = rest;

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