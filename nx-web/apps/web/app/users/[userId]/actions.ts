"use server";
import { revalidatePath } from "next/cache";
import { ActionApiResponse, COVERS_PICS_DIR } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { writeFile } from "node:fs";
import { z } from "zod";
import { authorizedAction } from "@web/lib/actions";
// @ts-ignore
import { zfd } from "zod-form-data";

const followUserSchema = z.string();

export const handleFollowUser = authorizedAction(followUserSchema, async (followingId: string, { userId }): Promise<ActionApiResponse> => {
   const follow = await xprisma.follows.create({
      data: {
         followerId: userId,
         followingId,
      },
   });

   if (!follow) return { success: false };

   revalidatePath(`/users/${followingId}`);
   revalidatePath(`/users/search`);
   return { success: true, data: follow };
});

export const handleUnfollowUser = authorizedAction(followUserSchema, async (followingId: string, { userId }): Promise<ActionApiResponse> => {
   const follow = await xprisma.follows.findFirst({
      where: {
         followerId: userId,
         followingId,
      },
   });
   if (!follow) return { success: false };

   await xprisma.follows.delete({
      where: {
         followingId_followerId: {
            followerId: userId,
            followingId,
         },
      },
   });

   revalidatePath(`/users/${followingId}`);
   revalidatePath(`/users/search`);
   return { success: true };
});

const editCoverImageSchema = zfd.formData({
   file: zfd.file().optional(),
});

export const editUserCoverImage = authorizedAction(editCoverImageSchema, async ({ file }, { userId }): Promise<ActionApiResponse> => {
   if (file && file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const name = `${Date.now()}_${randomUUID()}_${file.name.replaceAll(` `, `-`)}`;
      const filePath = path.join(COVERS_PICS_DIR, name);

      writeFile(filePath, buffer, { encoding: `utf8` }, (_) => {
      });

      // Save new profile pic to database:
      const profile = await xprisma.profile.update({
         where: { userId },
         data: {
            cover_image: filePath,
         },
      });
      console.log(`New profile`, { profile });

      revalidatePath(`/users/${userId}`);
      return { success: true };
   }

   return { success: false };
});
