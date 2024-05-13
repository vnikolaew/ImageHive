"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ActionApiResponse, sleep } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";
import { ImageComment } from "@prisma/client";
import { z } from "zod";
import { authorizedAction } from "@web/lib/actions";
import { inngest } from "@web/lib/inngest";

const commentSchema = z.object({
   imageId: z.string(),
   commentText: z.string(),
});

export const handleCommentOnImage = authorizedAction(
   commentSchema,
   async ({
             imageId,
             commentText,
          }, { userId }): Promise<ActionApiResponse<ImageComment>> => {
      await sleep(2000);

      const comment = await xprisma.imageComment.create({
         data: {
            imageId,
            raw_text: commentText,
            userId,
            metadata: {},
         }, include: { user: true },
      });

      if (!comment) return { success: false };
      const { updatePassword, verifyPassword, ...rest } = comment.user;
      // @ts-ignore
      comment.user = rest;

      await inngest.send({
         name: `image/image.commented`,
         data: {
            imageId,
            userId,
            timestamp: Date.now(),
         },
      });

      // revalidatePath(`/photos/${imageId}`);
      return { success: true, data: comment };
   });

const downloadSchema = z.string();

export const handleDownloadImage = authorizedAction(downloadSchema, async (imageId: string, { userId }): Promise<ActionApiResponse> => {
   await sleep(2000);
   const headers_ = headers();
   const ua = headers_.get(`user-agent`);

   let [download, image] = await Promise.all([
      xprisma.imageDownload.findFirst({
         where: {
            imageId,
            userId,
         },
      }),
      xprisma.image.findUnique({
         where: {
            id: imageId,
         },
         select: {
            id: true, dimensions_set: true, file_format: true,
         },
      }),
   ]);
   if (!image) return { success: false };

   if (!download) {
      download = await xprisma.imageDownload.create({
         data: {
            metadata: {
               "user-agent": ua,
               file_format: image.file_format,
               dimensions: image.dimensions_set[0].split(`,`).map(x => Number(x)),
            },
            imageId,
            userId,
         },
      });

      await inngest.send({
         name: `image/image.downloaded`,
         data: {
            imageId,
            userId,
            timestamp: Date.now(),
         },
      });
   }

   revalidatePath(`/photos/${imageId}`);
   return { success: true, data: download };
});
