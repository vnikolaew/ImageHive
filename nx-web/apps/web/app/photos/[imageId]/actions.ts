"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "../../../auth";
import { ActionApiResponse, sleep } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";

export async function handleCommentOnImage(imageId: string, commentText: string): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };
   await sleep(2000);

   const comment = await xprisma.imageComment.create({
      data: {
         imageId,
         raw_text: commentText,
         userId: session.user?.id as string,
         metadata: {},
      },
   });

   if (!comment) return { success: false };

   revalidatePath(`/photos/${imageId}`);
   return { success: true, data: comment };
}


export async function handleDownloadImage(imageId: string): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   await sleep(2000);
   const headers_ = headers();
   const ua = headers_.get(`user-agent`);

   let [download, image] = await Promise.all([
      xprisma.imageDownload.findFirst({
         where: {
            imageId,
            userId: session.user?.id as string,
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
            userId: session.user?.id as string,
         },
      });

   }

   revalidatePath(`/photos/${imageId}`);
   return { success: true, data: download };
}
