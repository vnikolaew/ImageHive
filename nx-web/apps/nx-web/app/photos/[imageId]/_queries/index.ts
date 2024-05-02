"use server";

import { cache } from "react";
import { Image, Profile, User } from "@prisma/client";
import { xprisma } from "@nx-web/db";
import { auth } from "../../../../auth";
import { getLikedImageIds } from "../../../_queries";

export type ImageSummary = Image & {
   owner: User & { _count: { followedBy: number, following: number }, profile: Profile },
   _count: { likes: number, comments: number, downloads: number, collections: number, views: number }
};

export const getImage = cache(async (id: string): Promise<ImageSummary | null> => {
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

   const { verifyPassword, updatePassword, ...rest } = image!.owner;
   // @ts-ignore
   image.owner = rest;

   return image as ImageSummary;
});

export async function getImageInfo(image: Image & { owner: any }) {
   const session = await auth();
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

   return { haveISaved, haveIFollowed, haveIDownloaded, haveILiked };
}
