"use server";
import { z } from "zod";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import { ActionApiResponse } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { PROFILE_PICS_DIR } from "@/lib/consts";
import { writeFile } from "node:fs";

const editProfileFormSchema = z.object({
   onlineProfiles: z.object({
      facebook: z.string(),
      twitter: z.string(),
      instagram: z.string(),
      soundCloud: z.string(),
      youtube: z.string(),
      website: z.string(),
   }),
   username: z.string(),
   profileImage: z.union([z.instanceof(File).nullable(), z.string().nullable()]),
   gender: z.union([
      z.literal(`MALE`), z.literal(`FEMALE`),
      z.literal(`UNSPECIFIED`),
   ]),
   firstName: z.string(),
   lastName: z.string(),
   city: z.string(),
   country: z.string(),
   dob: z.date().nullable(),
   aboutMe: z.string(),
});

async function uploadImage(file: File) {
   const buffer = Buffer.from(await file.arrayBuffer());

   const name = `${Date.now()}_${randomUUID()}_${file.name.replaceAll(` `, `-`)}`;
   const filePath = path.join(PROFILE_PICS_DIR, name);

   await new Promise<void>(res => {
      writeFile(filePath, buffer, { encoding: `utf8` }, (_) => {
         res();
      });
   });

   return filePath;
}

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>

export async function updateUserProfile(payload: FormData): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   console.log(Object.fromEntries(payload));
   const formBody: any = Object.fromEntries(payload);

   formBody.onlineProfiles = {
      facebook: formBody[`onlineProfiles[facebook]`],
      twitter: formBody[`onlineProfiles[twitter]`],
      instagram: formBody[`onlineProfiles[instagram]`],
      soundCloud: formBody[`onlineProfiles[soundCloud]`],
      youtube: formBody[`onlineProfiles[youtube]`],
      website: formBody[`onlineProfiles[website]`],
   };

   if (!!formBody.dob && typeof formBody.dob === `string`) formBody.dob = new Date(formBody.dob);

   const body = editProfileFormSchema
      .safeParse(formBody);

   if (!body.success) return { success: false, errors: body.error.errors };

   const editProfileBody = body.data;
   const profile = await xprisma.profile.update({
      where: { userId: session.user?.id! },
      data: {
         onlineProfiles: editProfileBody.onlineProfiles,
         gender: editProfileBody.gender,
         firstName: editProfileBody.firstName,
         lastName: editProfileBody.lastName,
         city: editProfileBody.city,
         country: editProfileBody.country,
         dateOfBirth: editProfileBody.dob ?? null,
         about: editProfileBody.aboutMe ?? null,
      },
   });

   if (!profile) return { success: false };
   if (editProfileBody.profileImage) {
      if (typeof editProfileBody.profileImage === `string`) {
         await xprisma.user.update({
            where: { id: session.user?.id! },
            data: { image: editProfileBody.profileImage },
         });

      } else {
         const filePath = await uploadImage(editProfileBody.profileImage);

         // Save new profile pic to database:
         const user = await xprisma.user.update({
            where: { id: session.user?.id },
            data: {
               image: filePath.replaceAll(`\\`, `/`),
            },
         });

         revalidatePath(`/users/${session.user?.id as string}`);
      }
   }

   revalidatePath(`/account/settings`);
   return { success: true, data: profile };
}