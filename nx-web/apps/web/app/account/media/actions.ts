"use server";

import { revalidatePath } from "next/cache";
import * as fs from "node:fs";
import { ImageUpload } from "@web/components/modals/actions";
import { xprisma } from "@nx-web/db";
import { DropboxService } from "@web/lib/dropbox";
import { authorizedAction } from "@web/lib/actions";
import { z } from "zod";

export interface ApiResponse {
   success: boolean;
}

const updateMediaSchema = z.object({
   inputFile: z.instanceof(File).optional(),
   imagePreview: z.string().optional(),
   id: z.string().optional(),
   tags: z.array(z.string()).optional(),
   description: z.string().optional(),
   aiGenerated: z.boolean().optional(),
});

export const handleUpdateMedia = authorizedAction(updateMediaSchema, async (payload: Partial<ImageUpload>, { userId }): Promise<ApiResponse> => {
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
});

const deleteMediaSchema = z.string();

export const deleteMedia = authorizedAction(deleteMediaSchema, async (imageId, { userId }): Promise<ApiResponse> => {
   const image = await xprisma.image.delete({
      where: { id: imageId, userId },
   });
   if (!image) return { success: false };

   console.log(`Deleted image with ID ${imageId}.`);

   // Delete from Dropbox as well:
   const db = new DropboxService();
   const res = await db.deleteImage(image.original_file_name);

   if (res.success) {
      console.log(`Deleted image with ID ${imageId} from Image storage.`);
   }

   if (fs.existsSync(image.absolute_url)) {
      fs.unlinkSync(image.absolute_url);
   }

   revalidatePath(`/account/media`);
   return { success: true };
});
