"use server";
import { cache } from "react";
import { auth } from "../../auth";
import { xprisma } from "@nx-web/db";

export const getImageLikes = cache(async () => {
   const session = await auth();
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
   const collections = await xprisma.imageCollection.findMany({
      where: { userId: session?.user?.id as string },
      include: { images: { select: { imageId: true } } },
   });
   return new Set(collections.flatMap(c => c.images.map(i => i.imageId)));
});

