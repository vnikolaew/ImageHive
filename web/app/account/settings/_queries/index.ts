"use server";

import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";

export async function getUserProfile() {

   const session = await auth();
   const user = await xprisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { profile: true },
   });

   // @ts-ignore
   const { verifyPassword, updatePassword, ...rest } = user;
   return rest;
}