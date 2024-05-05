"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@web/auth";
import { ActionApiResponse, COVERS_PICS_DIR, getFileExtension, sleep } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { writeFile } from "node:fs";
import { Readable } from "node:stream";
import probe from "probe-image-size";

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
   revalidatePath(`/users/search`);
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
   revalidatePath(`/users/search`);
   return { success: true };
}

export async function editUserCoverImage(formData: FormData): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   if (formData.has(`file`) && formData.get(`file`) instanceof File) {
      const file = formData.get(`file`)! as File;
      const buffer = Buffer.from(await file.arrayBuffer());

      const name = `${Date.now()}_${randomUUID()}_${file.name.replaceAll(` `, `-`)}`;
      const filePath = path.join(COVERS_PICS_DIR, name);

      writeFile(filePath, buffer, { encoding: `utf8` }, (_) => {
      });

      // Save new profile pic to database:
      const profile = await xprisma.profile.update({
         where: { userId: session.user.id },
         data: {
            cover_image: filePath,
         },
      });
      console.log(`New profile`, { profile});

      revalidatePath(`/users/${session.user?.id as string}`);
      return { success: true };
   }

   return { success: false };
}
