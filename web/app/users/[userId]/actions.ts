"use server"
import { auth } from "@/auth";
import { ActionApiResponse } from "@/lib/utils";
import { xprisma } from "@/lib/prisma";

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
   return { success: true, data: follow };
}