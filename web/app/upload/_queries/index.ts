"use server";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";

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