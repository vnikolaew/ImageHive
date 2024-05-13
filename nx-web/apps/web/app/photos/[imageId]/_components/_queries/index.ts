"use server";

import { xprisma } from "@nx-web/db";
import { Image } from "@prisma/client";

export async function getImageComments(imageId: string , limit = 20) {
   const imageComments = await xprisma.imageComment.findMany({
      where: { imageId },
      orderBy: { createdAt: `desc` },
      include: {
         user: {
            select: { id: true, image: true, name: true },
         },
      },
      take: limit
   });
   return imageComments;
}

export async function getSimilarImages(image: Image, page = 1) {
   const similarImages = await xprisma.image.findSimilarImages(image.tags, page, 10);
   return similarImages.filter(i => i.id !== image.id);
}

