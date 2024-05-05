"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, User } from "@prisma/client";
import PersonalDataSection from "./PersonalDataSection";
import OnlineProfilesSection from "./OnlineProfilesSection";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSessionImageSrc } from "@utils";
import { usePromise } from "@web/hooks/usePromise";
import { objectToFormData } from "@web/lib/utils";
import { updateUserProfile } from "@web/app/account/settings/actions";
import { TOASTS } from "@nx-web/shared";
import { Form } from "@components/form";
import { Separator } from "@components/separator";
import { Button } from "@components/button";
import { LoadingSpinner } from "@web/components/modals/SocialLogins";

export interface EditProfileFormWrapperProps {
   userProfile: Profile;
   user: User & { profile: Profile };
}

const formSchema = z.object({
   onlineProfiles: z.object({
      facebook: z.string(),
      twitter: z.string(),
      instagram: z.string(),
      soundCloud: z.string(),
      youtube: z.string(),
      website: z.string(),
   }),
   username: z.string(),
   profileImage: z.union([z.instanceof(File), z.string()]).nullable(),
   gender: z.union([
      z.literal(`MALE`), z.literal(`FEMALE`),
      z.literal(`UNSPECIFIED`),
   ]),
   firstName: z.string(),
   lastName: z.string(),
   city: z.string(),
   country: z.string(),
   dob: z.object({
      month: z.number().min(0).max(11).nullable(),
      day: z.number().min(0).max(30).nullable(),
      year: z.number().min(1934).max(2011).nullable(),
   }),
   aboutMe: z.string(),
});

export type EditProfileFormValues = z.infer<typeof formSchema>

const EditProfileFormWrapper = ({ userProfile, user }: EditProfileFormWrapperProps) => {
   const router = useRouter();
   const form = useForm<EditProfileFormValues>({
      resolver: zodResolver(formSchema),
      reValidateMode: `onChange`,
      defaultValues: {
         onlineProfiles: {
            facebook: userProfile.onlineProfiles?.facebook ?? ``,
            instagram: userProfile.onlineProfiles?.instagram ?? ``,
            soundCloud: userProfile.onlineProfiles?.soundCloud ?? ``,
            twitter: userProfile.onlineProfiles?.twitter ?? ``,
            website: userProfile.onlineProfiles?.website ?? ``,
            youtube: userProfile.onlineProfiles?.youtube ?? ``,
         },
         username: user?.name!,
         profileImage: getSessionImageSrc(user?.image!)!,
         firstName: userProfile.firstName ?? ``,
         lastName: userProfile.lastName ?? ``,
         city: userProfile.city ?? ``,
         country: userProfile.country ?? ``,
         dob: {
            month: !!userProfile.dateOfBirth ? userProfile.dateOfBirth.getMonth() + 1 : null,
            year: !!userProfile.dateOfBirth ? userProfile.dateOfBirth.getFullYear() : null,
            day: !!userProfile.dateOfBirth ? userProfile.dateOfBirth.getDate() : null,
         },
         aboutMe: userProfile.about ?? ``,
         gender: userProfile.gender ?? `Unspecified`,
      },
   });
   const { loading, action: editProfileAction } = usePromise((values: EditProfileFormValues) => {
      const fd = new FormData();
      if (Object.values(values.dob).every(x => !isNaN(x ?? NaN))) {
         // @ts-ignore
         values.dob = new Date(values.dob.year, values.dob.month, values.dob.day).toISOString();
      } else values.dob = null!;

      objectToFormData(values, fd, ``);

      return updateUserProfile(fd).then(res => {
         if (res.success) {
            console.log({ res });
            const { message, ...rest } = TOASTS.EDIT_PROFILE_SUCCESS;
            toast(message, { ...rest, icon: <Check size={16} /> });

            router.refresh();
         } else console.log(res);
      }).catch(console.error);
   });

   async function onSubmit(values) {
      console.log({ values });
      await editProfileAction(values);
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 !h-full">
            <div className={`grid gap-8 grid-cols-2 w-full `}>
               <div>
                  <h2 className={`text-xl`}>Edit Profile</h2>
                  <Separator className={`w-full my-4 h-[1px]`} />
                  <div>
                     <PersonalDataSection form={form} user={user!} />
                  </div>
               </div>
               <div>
                  <div className={`flex flex-col`}>
                     <h2 className={`text-xl`}>Online Profiles
                     </h2>
                     <Separator className={`w-full my-4 h-[1px]`} />
                     <div>
                        <OnlineProfilesSection form={form} />
                     </div>
                  </div>
               </div>
               <Separator className={`w-full my-4 h-[1px] col-span-2`} />
               <Button
                  disabled={loading}
                  size={`lg`} type={`submit`} variant={`default`}
                  className={`!px-24 shadow-sm my-4 col-span-2 !w-fit rounded-full mx-auto`}>
                  {loading ? (
                     <LoadingSpinner text={`Saving ...`} />
                  ) : `Save`}
               </Button>
            </div>
         </form>
      </Form>
   );
};

export default EditProfileFormWrapper;
