"use server";

import { revalidatePath } from "next/cache";
import { xprisma } from "@nx-web/db";
import { authorizedAction } from "@web/lib/actions";
import { z } from "zod";
import { inngest } from "@web/lib/inngest";

export interface ApiResponse {
   success: boolean;
}

const likeSchema = z.string();

export const handleLikeImage = authorizedAction(likeSchema, async (imageId: string, { userId }): Promise<ApiResponse> => {
   const existing = await xprisma.imageLike.findFirst({
      where: { imageId, userId },
   });
   if (existing) {
      console.log({ existing });
      return { success: false };
   }

   const imageLike = await xprisma.imageLike.create({
      data: {
         imageId,
         userId,
         metadata: {},
      },
   });
   console.log({ imageLike });

   await inngest.send({
      name: `image/image.liked`,
      data: {
         imageId: imageLike.imageId,
         userId,
         timestamp: Date.now(),
      },
   });

   revalidatePath(`/`);
   revalidatePath(`/photos/${imageId}`);
   return { imageLike, success: true };
});

export const handleUnlikeImage = authorizedAction(likeSchema, async (imageId: string, { userId }): Promise<ApiResponse> => {
   const existing = await xprisma.imageLike.findFirst({
      where: { imageId, userId },
   });
   if (!existing) return { success: false };

   const imageLike = await xprisma.imageLike.delete({
      where: { id: existing.id, userId },
   });

   console.log({ imageLike });

   await inngest.send({
      name: `image/image.unliked`,
      data: {
         imageId: imageLike.imageId,
         userId,
         timestamp: Date.now(),
      },
   });

   revalidatePath(`/`);
   revalidatePath(`/photos/${imageId}`);
   return { success: true };
});

const addImageSchema = z.object({
   imageId: z.string(),
   collectionId: z.string(),
});

export const handleAddImageToCollection = authorizedAction(
   addImageSchema,
   async ({
             imageId,
             collectionId,
          }, { userId }): Promise<ApiResponse> => {
      const collection = await xprisma.imageCollection.findUnique({
         where: { id: collectionId, userId },
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

      await inngest.send({
         name: `image/image.addedToCollection`,
         data: {
            imageId: collectionImage.imageId,
            userId,
            timestamp: Date.now(),
            collectionId: collectionImage.collectionId,
         },
      });

      revalidatePath(`/`);
      revalidatePath(`/photos/${imageId}`);
      return { success: true, collectionImage };
   });

export const handleRemoveImageFromCollection = authorizedAction(
   addImageSchema,
   async ({
             collectionId,
             imageId,
          }, { userId }): Promise<ApiResponse> => {
      const collection = await xprisma.imageCollection.findUnique({
         where: { id: collectionId, userId },
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

      await inngest.send({
         name: `image/image.removedFromCollection`,
         data: {
            imageId: collectionImage.imageId,
            userId,
            timestamp: Date.now(),
            collectionId: collectionImage.collectionId,
         },
      });


      revalidatePath(`/`);
      revalidatePath(`/photos/${imageId}`);
      return { success: true, collectionImage };
   });
