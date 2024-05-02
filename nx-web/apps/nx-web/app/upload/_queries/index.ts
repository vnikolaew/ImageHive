"use server";

import { auth } from "apps/nx-web/auth";
import { xprisma } from "@nx-web/db";

function oneWeekAgo() {
   return new Date(new Date().getTime() - (60 * 60 * 24 * 7 * 1000));
}

export async function getUserImagesCount() {
   const session = await auth();
   const userImagesCount = await xprisma.image.count({
      where: {
         AND: [
            {
               userId: session?.user?.id as string,
               is_deleted: false,
            },
            {
               createdAt: {
                  gte: oneWeekAgo(),
               },
            },
         ],
      },
   });

   return userImagesCount;
}
