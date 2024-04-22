"use server";

import { auth } from "@/auth";
import { ImageUpload } from "@/app/upload/_store/imageUploadsStore";
import { getFileExtension, normalizeFormData } from "@/lib/utils";
import path from "node:path";
import probe from "probe-image-size";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs";
import { Image } from "@prisma/client";
import { xprisma } from "@/lib/prisma";
import { Readable } from "node:stream";
import { revalidatePath } from "next/cache";
import { UPLOADS_DIR } from "@/lib/consts";
import { Configuration, ImagesApi } from "@/lib/api";
import { constants } from "node:http2";


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
      const response = await new ImagesApi(new Configuration({
         get basePath(): string {
            return process.env.BACKEND_API_URL!;
         },
      }))
   .classifyNewImageImagesClassifyImageIdPostRaw({ imageId: uploadResponse.image.id });
      return { success: response.raw.status === constants.HTTP_STATUS_ACCEPTED };
   }

   return { success: false };
}

export async function handleUploadImages(formData: FormData) {
   const session = await auth();
   if (!session) return { success: false };

   const uploads: Partial<ImageUpload>[] = normalizeFormData(Object.fromEntries(formData));

   // Handle image uploads:
   const uploadTasks = uploads
      .map(u => handleUploadImage(u as any, session.user?.id!));
   const results = await Promise.all(uploadTasks);

   revalidatePath(`/file-upload`);
   return results.every(r => r.success) ?
      { success: true } : { success: false };
}

