"use server";

import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import { User } from "@prisma/client";

export async function getUser(userId: string) {
   const session = await auth();
   const user = await xprisma.user.findUnique({
      where: { id: userId },
      include: {
         images: {
            take: 20,
            include: {
               _count: { select: { likes: true } },
            },
         },
         profile: true,
         accounts: true,
         _count: { select: { followedBy: true, imageDownloads: true, imageLikes: true, following: true } },
      },
   });
   if (!user) return null!;

   const { verifyPassword, updatePassword, ...rest } = user;
   //@ts-ignore
   rest.accounts = rest.accounts.map(a => {
      const { deleteResetToken, ...rest } = a;
      return rest;
   });

   const amIFollower = (await xprisma.follows.count({
      where: { followerId: session?.user?.id, followingId: user.id },
   })) > 0;

   const isMe = user.id === session?.user?.id as string;
   return { user: rest as User, isMe, amIFollower };
}
