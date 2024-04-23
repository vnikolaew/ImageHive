"use server";

import { auth } from "@/auth";
import { ApiResponse } from "@/app/account/media/actions";
import { xprisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function handleLikeImage(imageId: string): Promise<ApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const existing = await xprisma.imageLike.findFirst({
      where: { imageId, userId: session.user?.id },
   });
   if (existing) {
      console.log({ existing });
      return { success: false };
   }

   const imageLike = await xprisma.imageLike.create({
      data: {
         imageId,
         userId: session.user?.id as string,
         metadata: {},
      },
   });
   console.log({ imageLike });

   revalidatePath(`/`);
   return { imageLike, success: true };
}

export async function handleUnlikeImage(imageId: string): Promise<ApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const existing = await xprisma.imageLike.findFirst({
      where: { imageId, userId: session.user?.id },
   });
   if (!existing) return { success: false };

   const imageLike = await xprisma.imageLike.delete({
      where: { id: existing.id, userId: session.user?.id },
   });

   console.log({ imageLike });

   revalidatePath(`/`);
   return { success: true };
}

export async function handleAddImageToCollection(imageId: string, collectionId: string): Promise<ApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const collection = await xprisma.imageCollection.findUnique({
      where: { id: collectionId, userId: session.user?.id },
   });
   if (!collection) return { success: false };

   const existing = await xprisma.collectionImage.findFirst({
      where: { collectionId: collection.id, imageId },
   });
   if (existing) return { success: false };

   const collectionImage = await xprisma.collectionImage.create({
      data: {
         collectionId: collection.id,
         imageId,
         metadata: {},
      },
   });

   return { success: true, collectionImage };
}

export async function handleRemoveImageFromCollection(imageId: string, collectionId: string): Promise<ApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const collection = await xprisma.imageCollection.findUnique({
      where: { id: collectionId, userId: session.user?.id },
   });
   if (!collection) return { success: false };

   const existing = await xprisma.collectionImage.findFirst({
      where: { collectionId: collection.id, imageId },
   });
   if (!existing) return { success: false };

   const collectionImage = await xprisma.collectionImage.delete({
      where: {
         id: existing.id,
      },
   });

   return { success: true, collectionImage };
}
