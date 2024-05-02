"use server";

import { Image, ImageCollection, ImageDownload, Prisma, User } from "@prisma/client";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import { SortOptions } from "@/app/account/collections/page";

export type ImageCollectionItem
   = (ImageCollection & {
   images: {
      metadata: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
      id: string
      is_deleted: boolean
      collectionId: string
      imageId: string,
      image: Image
   }[],
});


export type ImageDownloadItem = ImageDownload & { image: Image & { owner: User } }


export async function getUserImageCollections(
   searchParams: { sort: string, tab?: string, qs?: string },
): Promise<ImageCollectionItem[]> {
   const session = await auth();
   let orderBy: Prisma.ImageCollectionOrderByWithRelationAndSearchRelevanceInput | Prisma.ImageCollectionOrderByWithRelationAndSearchRelevanceInput[] | undefined;

   console.log({ searchParams });
   if (searchParams.sort === SortOptions[0]) {
      orderBy = { updatedAt: `desc` };
   } else if (searchParams.sort === SortOptions[1]) {
      orderBy = { title: `desc` };
   }

   let titleFilter: string | Prisma.StringFilter<"ImageCollection"> | undefined;
   if (searchParams.qs?.length) {
      titleFilter = {
         contains: searchParams.qs,
         mode: `insensitive`,
      };
   }
   const userCollections = await xprisma
      .imageCollection
      .findMany({
         where: {
            userId: session?.user?.id as string,
            ...(titleFilter ? { title: titleFilter } : {}),
         },
         ...(orderBy ? { orderBy } : {}),
         include: {
            images: {
               take: 3,
               orderBy: { createdAt: `desc` },
               include: {
                  image: true,
               },
            },
         },
      });

   return userCollections;
}

export async function getUserImageDownloads(): Promise<ImageDownloadItem[]> {
   const session = await auth();
   const downloads = await xprisma.imageDownload.findMany({
      where: {
         userId: session?.user?.id as string,
      },
      orderBy: {
         createdAt: "desc",
      },
      include: {
         image: {
            include: { owner: true },
         },
      },
   });

   downloads.forEach(d => {
      const { verifyPassword, updatePassword, ...rest } = d.image.owner;
      //@ts-ignore
      d.image.owner = rest;
   });

   return downloads;
}
