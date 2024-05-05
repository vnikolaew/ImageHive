"use server";

import { CollectionImage, Image, ImageCollection, User } from "@prisma/client";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";

export type CollectionItem = ImageCollection & { images: (CollectionImage & { image: Image & { owner: User } })[] }

export async function getImageCollectionById(collectionId: string): Promise<CollectionItem> {
   const session = await auth();
   const collection = await xprisma.imageCollection.findFirst({
      where: {
         userId: session!.user?.id as string,
         id: collectionId,
      },
      include: {
         images: {
            include: {
               image: {
                  include: { owner: true },
               },
            },
         },
      },
   });

   if (!collection) return null!;

   collection.images = collection.images.map(i => {
      const user = i.image.owner;
      const { updatePassword, verifyPassword, ...rest } = user;
      // @ts-ignore
      i.image.owner = rest;
      return i;
   });

   return collection;
}
