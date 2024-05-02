"use server"

import { xprisma } from "@nx-web/db";
import { Image } from "@prisma/client";
import { groupBy } from "lodash";

export async function getImageComments(imageId: string) {
   const imageComments = await xprisma.imageComment.findMany({
      where: { imageId },
      orderBy: { createdAt: `desc` },
      include: {
         user: {
            select: { id: true, image: true, name: true },
         },
      },
   });
   return imageComments;
}

export async function getSimilarImages(image: Image) {
   const similarImages = await xprisma.image.findSimilarImages(image, 10);
   const images = Object
      .entries(groupBy(similarImages, `id`))
      .sort((a, b) => b[1].length - a[1].length)
      .map(x => x[1][0])
      .filter(i => i.id !== image.id);

   return images;

}

