"use server";

import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";

export async function getStatistics() {
   const session = await auth();
   const userImages = await xprisma.image.findMany({
      where: {
         userId: session?.user?.id as string,
      },
      include: {
         _count: {
            select: {
               comments: true,
               likes: true,
               downloads: true,
               views: true,
            },
         },
      },
   });

   const imageViews = userImages
      .map(i => i._count.views)
      .reduce((a, b) => a + b, 0);

   const imageLikes = userImages
      .map(i => i._count.likes)
      .reduce((a, b) => a + b, 0);

   const imageDownloads = userImages
      .map(i => i._count.downloads)
      .reduce((a, b) => a + b, 0);

   const imageComments = userImages
      .map(i => i._count.comments)
      .reduce((a, b) => a + b, 0);

   return { imageLikes, imageComments, imageDownloads, imageViews };
}
