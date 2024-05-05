"use server";

import { revalidatePath } from "next/cache";
import * as fs from "node:fs";
import { ImageUpload } from "@web/components/modals/actions";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";

export interface ApiResponse {
   success: boolean;
}

export async function handleUpdateMedia(payload: Partial<ImageUpload>): Promise<ApiResponse> {
   const session = await auth();
   if (!session) return { success: false };


   const { id, description, tags, aiGenerated } = payload;
   let image = await xprisma.image.findUnique({
      where: { id },
   });
   if (!image) return { success: false };

   image = await xprisma.image.update({
      where: { id: image.id, userId: image.userId },
      data: {
         title: description,
         tags,
         //@ts-ignore
         metadata: { ...(image.metadata ?? {}), aiGenerated },
      },
   });
   console.log({ newImage: image });

   revalidatePath(`/account/media`);
   return { success: true };
}

export async function deleteMedia(imageId: string): Promise<ApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const image = await xprisma.image.delete({
      where: { id: imageId, userId: session.user?.id },
   });
   if (!image) return { success: false };

   console.log(`Deleted image with ID ${imageId}.`);
   if (fs.existsSync(image.absolute_url)) {
      fs.unlinkSync(image.absolute_url);
   }

   revalidatePath(`/account/media`);
   return { success: true };
}
