"use server";

import path from "node:path";
import probe from "probe-image-size";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs";
import { Image } from "@prisma/client";
import { Readable } from "node:stream";
import { revalidatePath } from "next/cache";
import { Queue } from "bullmq";
import { xprisma } from "@nx-web/db";
import {
  ActionApiResponse,
  getFileExtension,
  normalizeFormData,
  PROFILE_PICS_DIR,
  sleep,
  UPLOADS_DIR,
} from "@nx-web/shared";
import { auth } from "../../auth";


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

const REDIS_CONNECTION = {
   host: `localhost`,
   port: 6379,
};

const queue = new Queue(`classify_images`, {
   connection: REDIS_CONNECTION,
});

export async function uploadFile(
   imageUpload: ImageUpload,
   name: string,
   directory: string,
   dimensions: Dimensions,
   userId: string,
): Promise<UploadFileResponse> {
   "use server";
   const buffer = Buffer.from(await imageUpload.inputFile!.arrayBuffer());

   try {
      const filePath = path.join(directory, name);
      writeFile(filePath, buffer, { encoding: `utf8` }, (_) => {
      });

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
            absolute_url: filePath,
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
      UPLOADS_DIR,
      [width, height],
      userId,
   );

   if (uploadResponse.success) {
      // const response = await new ImagesApi(new Configuration({
      //    get basePath(): string {
      //       return process.env.BACKEND_API_URL!;
      //    },
      // }))
      //    .classifyNewImageImagesClassifyImageIdPostRaw({ imageId: uploadResponse.image.id });

      // Post a new Redis job:
      await queue.add(`classify_image_${uploadResponse.image.id}`,
         {
            imageId: uploadResponse.image.id,
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
   return results.every(r => r.success) ?
      { success: true } : { success: false };
}

export async function handleUpdateProfilePicture(formData: FormData): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };
   await sleep(2000);

   if (formData.has(`file`)) {
      const file = formData.get(`file`)! as File;
      const buffer = Buffer.from(await file.arrayBuffer());

      const name = `${Date.now()}_${randomUUID()}_${file.name.replaceAll(` `, `-`)}`;
      const filePath = path.join(PROFILE_PICS_DIR, name);

      writeFile(filePath, buffer, { encoding: `utf8` }, (_) => {
      });

      // Save new profile pic to database:
      const user = await xprisma.user.update({
         where: { id: session.user?.id },
         data: {
            image: filePath.replaceAll(`\\`, `/`),
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

