"use server";

import probe from "probe-image-size";
import { randomUUID } from "node:crypto";
import { Image } from "@prisma/client";
import { Readable } from "node:stream";
import { revalidatePath } from "next/cache";
import { xprisma } from "@nx-web/db";
import {
   ActionApiResponse,
   getFileExtension,
   sleep,
} from "@nx-web/shared";
import { auth } from "@web/auth";
import { normalizeFormData } from "@web/lib/utils";
import { inngest } from "@web/lib/inngest";
import { DropboxService } from "@web/lib/dropbox";


export interface ImageUpload {
   inputFile: File;
   imagePreview: string;
   id: string;
   tags: string[];
   description?: string;
   aiGenerated: boolean;
}

export type UploadFileResponse = {
   success: true;
   image: Image;
} | {
   success: false;
}

export type Dimensions = [number, number]

export async function uploadFile(
   imageUpload: ImageUpload,
   name: string,
   dimensions: Dimensions,
   userId: string,
): Promise<UploadFileResponse> {
   "use server";
   const db = new DropboxService();

   try {
      // Upload image to Dropbox:
      const res = await db.uploadImage(imageUpload.inputFile, name);
      if (!res.success) return { success: false };

      // Create a shared link
      const shareResponse = await db.sharingImageCreate(res.response.path_display);
      if (!shareResponse.success) return { success: false };

      const shareLink = shareResponse.response.url.replaceAll(`dl=0`, `raw=1`);

      console.log(`[${new Date().toISOString()}] Uploaded new file to '${res.response.path_display}'.`);

      // Add image to DB:
      const [width, height] = dimensions;
      const image = await xprisma.image.create({
         data: {
            original_file_name: imageUpload.inputFile.name,
            dimensions_set: [`${width},${height}`],
            createdAt: new Date(),
            file_format: getFileExtension(imageUpload.inputFile.name),
            tags: imageUpload.tags ?? [],
            userId,
            absolute_url: shareLink,
            title: imageUpload.description,
            metadata: { aiGenerated: /^true$/i.test(imageUpload.aiGenerated?.toString()) },
         },
      });
      return { success: true, image };
   } catch (error) {
      console.error(error);
      return { success: false };
   }
}

export async function handleUploadImage(imageUpload: ImageUpload, userId: string): Promise<{ success: boolean }> {
   const stream = new Readable();

   stream.push(new Uint8Array(await imageUpload.inputFile!.arrayBuffer()));
   stream.push(null);

   const { height, width } = await probe(stream);

   const uploadResponse = await uploadFile(
      imageUpload,
      `${Date.now()}_${randomUUID()}_${imageUpload.inputFile!.name.replaceAll(` `, `-`)}`,
      [width, height],
      userId,
   );

   if (uploadResponse.success) {
      await inngest.send({
         name: `test/image.classify`,
         data: {
            imageId: uploadResponse.image.id,
         }, id: randomUUID(),
      });

      return { success: true };
   }

   return { success: false };
}

export async function handleUploadImages(formData: FormData) {
   const session = await auth();
   if (!session) return { success: false };

   const uploads: Partial<ImageUpload>[] = normalizeFormData(Object.fromEntries(formData));

   // Handle image uploads:
   const uploadTasks = uploads
      .map(u => handleUploadImage(u as any, session.user?.id));
   const results = await Promise.all(uploadTasks);

   revalidatePath(`/file-upload`);
   return results.every(r => r.success) ? { success: true } : { success: false };
}

export async function handleUpdateProfilePicture(formData: FormData): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   await sleep(2000);
   const db = new DropboxService();

   if (formData.has(`file`)) {
      const file = formData.get(`file`)! as File;

      const name = `${Date.now()}_${randomUUID()}_${file.name.replaceAll(` `, `-`)}`;

      // Upload new profile picture to Dropbox:
      const res = await db.uploadProfilePicture(file, name);
      if (!res.success) return { success: false };

      // Create a shared link
      const shareResponse = await db.sharingImageCreate(res.response.path_display);
      if (!shareResponse.success) return { success: false };

      const shareLink = shareResponse.response.url.replaceAll(`dl=0`, `raw=1`);

      console.log(`[${new Date().toISOString()}] Uploaded new file to '${res.response.path_display}'.`);

      let user = await xprisma.user.findUnique({
         where: { id: session.user?.id },
         select: { id: true, metadata: true },
      });
      if (!user) return { success: false };

      if (!!user?.metadata?.fileName?.length) {
         const res = await db.deleteProfilePicture(user.metadata?.fileName!);
         if (res.success) {
            console.log(`Successfully deleted old profile picture for user ${user.id}:  '${res.response.metadata.path_display}'`);
         }
      }

      // Save new profile pic to database:
      user = await xprisma.user.update({
         where: { id: session.user?.id },
         data: {
            image: shareLink,
            metadata: { ...(user.metadata ?? {}), fileName: name },
         },
      });
      revalidatePath(`/users/${session.user?.id as string}`);

      const { verifyPassword, updatePassword, ...rest } = user;
      return { success: true, data: rest };
   } else if (formData.has(`url`)) {
      const imageUrl = formData.get(`url`)! as string;

      // Save profile pic URL to database:
      const user = await xprisma.user.update({
         where: { id: session.user?.id },
         data: {
            image: imageUrl,
         },
      });
      const { verifyPassword, updatePassword, ...rest } = user;

      revalidatePath(`/users/${session.user?.id as string}`);
      return { success: true, data: rest };
   }

   return { success: false };
}

