"use server";
import { cache } from "react";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import { FeedSortOptions } from "@web/app/page";
import { Image } from "@prisma/client";

export const getImageLikes = cache(async () => {
   const session = await auth();
   if (!session) return [];
   return await xprisma.imageLike.findMany({
      where: { userId: session?.user?.id as string },
   });
});

export const getLikedImageIds = cache(async () => {
   const likedImages = await getImageLikes();
   return new Set<string>(likedImages.map(i => i.imageId));
});

export const getImageSavesIds = cache(async () => {
   const session = await auth();
   if (!session) return new Set<string>();

   const collections = await xprisma.imageCollection.findMany({
      where: { userId: session?.user?.id as string },
      include: { images: { select: { imageId: true } } },
   });
   return new Set(collections.flatMap(c => c.images.map(i => i.imageId)));
});

export const getUserTheme = cache(async () => {
   const session = await auth();
   if (session) {
      const userTheme = await xprisma.user.findUnique({
         where: { id: session?.user?.id as string },
         select: { metadata: true, id: true },
      });
      return userTheme.metadata?.["theme"] as string;
   }

   return null! as string;
});

export const getUserHomeFeed = cache(async (order: (typeof FeedSortOptions)[number], hideAi = false, page = 1, limit = 20) => {
   const session = await auth();

   let images: Image[];
   switch (order) {
      case `Latest`:
         images = await xprisma.image.homeFeedRaw_Latest(page, limit);
         break;
      case `Trending`:
         images = await xprisma.image.homeFeedRawNew(page, limit);
         break;
      default:
         images = await xprisma.image.homeFeedRaw_Latest(page, limit);
         break;
   }

   console.log({ images });
   images = (hideAi ? [...images].filter(i => !i.metadata?.aiGenerated) : images);

   return images;
});
