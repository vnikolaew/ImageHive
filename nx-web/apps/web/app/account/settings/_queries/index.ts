"use server";


import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";

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
