"use server";

import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";

export async function getUserFollowings() {
   const session = await auth();
   if (!session) return [];

   const following = await xprisma.follows.findMany({
      where: { followerId: session.user?.id },
      include: {
         following: {
            include: {
               _count: {
                  select: {
                     images: true,
                     imageDownloads: true,
                     imageLikes: true,
                  },
               },
            },
         },
      },
   });

   following.forEach(f => {
      const { updatePassword, verifyPassword, ...rest } = f.following;
      // @ts-ignore
      f.following = rest;
   });

   return following;
}