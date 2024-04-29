"use server";
import { auth } from "@/auth";
import { ActionApiResponse } from "@/lib/utils";
import { xprisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function handleFollowUser(userId: string): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const follow = await xprisma.follows.create({
      data: {
         followerId: session.user?.id!,
         followingId: userId,
      },
   });

   if (!follow) return { success: false };

   revalidatePath(`/users/${userId}`);
   return { success: true, data: follow };
}

export async function handleUnfollowUser(userId: string): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const follow = await xprisma.follows.findFirst({
      where: {
         followerId: session.user?.id!,
         followingId: userId,
      },
   });
   if (!follow) return { success: false };

   await xprisma.follows.delete({
      where: {
         followingId_followerId: {
            followerId: session.user?.id!,
            followingId: userId,
         },
      },
   });

   revalidatePath(`/users/${userId}`);
   return { success: true };
}
