"use server";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionApiResponse, sleep } from "@/lib/utils";

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

   let download = await xprisma.imageDownload.findFirst({
      where: {
         imageId,
         userId: session.user?.id as string,
      },
   });

   if (!download) {
      download = await xprisma.imageDownload.create({
         data: {
            metadata: {},
            imageId,
            userId: session.user?.id as string,
         },
      });

   }

   revalidatePath(`/photos/${imageId}`);
   return { success: true, data: download };
}
