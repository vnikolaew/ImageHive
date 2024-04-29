import React from "react";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import EditProfileFormWrapper from "@/app/account/settings/_components/EditProfileFormWrapper";

const Page = async () => {
   const session = await auth();
   const user = await xprisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { profile: true },
   });

   // @ts-ignore
   const { verifyPassword, updatePassword, ...rest } = user;

   return (
      <div className={`my-8 min-h-[70vh]`}>
         <EditProfileFormWrapper userProfile={user!.profile!} user={rest!} />
      </div>
   );
};

export default Page;